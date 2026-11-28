'use client';
import { useEffect, useRef, useState } from 'react';
import { adminReadPage, adminSavePage, adminPageSummaries, adminUploadImage } from '@admin-actions';
import { cmsPages } from '../lib/cms-catalog';
import { canEditContent } from '../lib/admin-types';
import type { CmsDocument, CmsField, CmsValues } from '../lib/cms-contract';
import { useAdminIdentity, useAdminUnsaved } from './admin-shell';
import { sitePath } from '../lib/site-path';
import styles from './admin.module.css';
const sectionNames: Record<string, string> = { 'Тексты и подписи': 'Заголовки, тексты и кнопки', departments: 'Отделы и часы работы', steps: 'Этапы', options: 'Варианты', payments: 'Варианты оплаты', features: 'Преимущества', benefits: 'Преимущества', facts: 'Факты', services: 'Услуги', projects: 'Проекты', stats: 'Цифры компании', conditions: 'Условия', partners: 'Партнёры', documents: 'Документы', process: 'Порядок действий' };
const fieldCount = (count: number) => `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'поле' : [2,3,4].includes(count % 10) && ![12,13,14].includes(count % 100) ? 'поля' : 'полей'}`;
const sectionTitle = (name: string, index: number) => sectionNames[name] || (/[А-Яа-я]/.test(name) ? name : `Блок ${index + 1}`);
const effective = (field: CmsField, values: CmsValues) => values[field.key] ?? field.value;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function AdminPages() {
  const user = useAdminIdentity(), editable = canEditContent(user.role);
  const [selected, setSelected] = useState('home'), [search, setSearch] = useState(''), [fieldSearch, setFieldSearch] = useState('');
  const [document, setDocument] = useState<CmsDocument | null>(null), [values, setValues] = useState<CmsValues>({});
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [message, setMessage] = useState('');
  const [summaries, setSummaries] = useState<Awaited<ReturnType<typeof adminPageSummaries>>>([]);
  const [confirmation, setConfirmation] = useState<'publish' | 'reset' | null>(null), [nextPage, setNextPage] = useState<string | null>(null);
  const sequence = useRef(0);
  const page = cmsPages.find(p => p.id === selected)!;
  const dirty = !!document && !same(values, document.draft);
  useAdminUnsaved(dirty);
  const changes = page.fields.filter(field => effective(field, values) !== effective(field, document?.published ?? {}));
  const visibleFields = page.fields.filter(field => `${field.label} ${effective(field, values)}`.toLocaleLowerCase('ru').includes(fieldSearch.toLocaleLowerCase('ru')));
  const sections = [...new Set(visibleFields.map(f => f.section))];
  useEffect(() => { adminPageSummaries().then(setSummaries).catch(() => setMessage('Не удалось загрузить состояние страниц.')); }, []);
  useEffect(() => {
    const current = ++sequence.current; setLoading(true); setDocument(null); setValues({}); setMessage(''); setFieldSearch('');
    adminReadPage(selected).then(doc => { if (sequence.current === current) { setDocument(doc); setValues(doc.draft); } }).catch(() => { if (sequence.current === current) setMessage('Не удалось загрузить страницу. Обновите список или войдите заново.'); }).finally(() => { if (sequence.current === current) setLoading(false); });
  }, [selected]);
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  function update(key: string, value: string | number) { setValues(current => ({ ...current, [key]: value })); setMessage(''); }
  async function save(publish: boolean) {
    if (!document || busy) return; setBusy(true); setMessage('');
    try {
      const result = await adminSavePage(selected, document.revision, values, publish);
      setMessage(result.message);
      if (!result.ok) setConfirmation(null);
      if (result.ok) { setDocument(result.document); setValues(result.document.draft); setConfirmation(null); setSummaries(await adminPageSummaries().catch(() => summaries)); }
    } catch { setConfirmation(null); setMessage('Не удалось сохранить. Ваши правки остались в редакторе.'); } finally { setBusy(false); }
  }
  async function upload(field: CmsField, file?: File) {
    if (!file) return; setBusy(true); setMessage('');
    try { const data = new FormData(); data.set('file', file); const result = await adminUploadImage(data); if (result.ok) update(field.key, result.url); else setMessage(result.message); } catch { setMessage('Изображение не загрузилось. Повторите попытку.'); } finally { setBusy(false); }
  }
  const dialog = confirmation || nextPage;
  return <div className={styles.content}>
    <header className={styles.pageHeader}><div><p className={styles.eyebrow}>Содержание сайта</p><h1>Страницы и контент</h1><p>Выберите страницу или общий блок. Черновики сохраняются отдельно от опубликованной версии.</p></div><a href={sitePath('/')} target="_blank" rel="noopener noreferrer">Открыть сайт ↗</a></header>
    <div className={styles.editorLayout}>
      <aside className={styles.pageList}><label>Найти страницу<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Название страницы или раздела" /></label>
        {['Страницы', 'Посёлки', 'Общие блоки'].map(group => { const items = cmsPages.filter(p => p.group === group && `${p.title} ${p.path}`.toLowerCase().includes(search.toLowerCase())); return items.length ? <div key={group}><h2>{group}</h2>{items.map(p => { const summary = summaries.find(s => s.id === p.id); return <button key={p.id} aria-pressed={selected === p.id} disabled={busy} onClick={() => { if (selected === p.id) return; if (dirty) setNextPage(p.id); else setSelected(p.id); }}><span>{p.title}</span><small>{summary?.hasDraft ? 'Есть черновик' : summary?.publishedAt ? 'Опубликовано' : fieldCount(p.fields.length)}</small></button>; })}</div> : null; })}
        {!cmsPages.some(p => `${p.title} ${p.path}`.toLowerCase().includes(search.toLowerCase())) && <p>Ничего не найдено.</p>}
      </aside>
      <section className={styles.editor} aria-label="Редактор страницы" aria-busy={loading || busy}>
        <header className={styles.editorHeader}><div><h2>{page.title}</h2><p>{page.path}</p>{document?.updatedAt && <small>Сохранено: {new Date(document.updatedAt).toLocaleString('ru-RU')} · {document.updatedBy}</small>}</div><div className={styles.actions}>
          <a href={sitePath(page.path)} target="_blank" rel="noopener noreferrer">На сайте ↗</a>
          {document && <a href={`${sitePath(page.path)}?admin-preview=${page.id}`} target="_blank" rel="noopener noreferrer" aria-label="Предпросмотр сохранённого черновика">Предпросмотр ↗</a>}
        </div></header>
        <div className={styles.saveBar}><span>{dirty ? 'Есть несохранённые правки' : changes.length ? 'Черновик отличается от сайта' : 'Версия совпадает с сайтом'}</span>{editable && <div className={styles.actions}><button disabled={busy || !document || !dirty} onClick={() => { if (document) setValues(document.draft); }}>Отменить правки</button><button disabled={busy || !document || !dirty} onClick={() => save(false)}>Сохранить черновик</button>{user.role === 'admin' && <button className={styles.primary} disabled={busy || !document || changes.length === 0} onClick={() => setConfirmation('publish')}>Опубликовать</button>}</div>}</div>
        <div role="status" className={styles.message}>{message}</div>
        {!editable && <p>Ваша роль разрешает только просмотр.</p>}
        {user.role === 'editor' && <p className={styles.hint}>Вы сохраняете черновики. Администратор проверяет и публикует изменения.</p>}
        {dirty && <p className={styles.hint}>Для предпросмотра новых правок сначала сохраните черновик.</p>}
        {loading ? <p>Загружаем поля…</p> : document && <>
          <label className={styles.fieldSearch}>Найти поле<input type="search" value={fieldSearch} onChange={event => setFieldSearch(event.target.value)} placeholder="Например, заголовок или часть текста" /></label>
          {!visibleFields.length && <p>Подходящих полей нет.</p>}
          {sections.map((section, index) => <details className={styles.fieldSection} key={section} open={!!fieldSearch || sections.length <= 2 || index === 0}><summary>{sectionTitle(section, index)}<span>{visibleFields.filter(f => f.section === section).length}</span></summary>
            <div className={styles.fields}>{visibleFields.filter(f => f.section === section).map(field => <div className={field.kind === 'image' ? styles.imageField : styles.field} key={field.key}>
              {field.kind === 'image' && /^\/(images|icons|admin-media)\//.test(String(effective(field, values))) && !String(effective(field, values)).includes('..') && <img src={sitePath(String(effective(field, values)))} alt="Текущее изображение" loading="lazy" />}
              <div><label><span>{field.label}{effective(field, values) !== effective(field, document.published) && <small className={styles.changed}>Изменено</small>}</span>
                {field.kind === 'text' ? <textarea disabled={!editable || busy} value={String(effective(field, values))} rows={String(effective(field, values)).length > 180 ? 5 : String(effective(field, values)).length > 65 ? 3 : 2} maxLength={15000} onChange={event => update(field.key, event.target.value)} /> : <input disabled={!editable || busy} type={field.kind === 'number' ? 'number' : 'text'} min={field.kind === 'number' ? 0 : undefined} max={field.kind === 'number' ? 1e12 : undefined} step={field.kind === 'number' ? 'any' : undefined} value={effective(field, values)} onChange={event => update(field.key, field.kind === 'number' ? Number(event.target.value) : event.target.value)} />}
              </label>{field.kind === 'image' && editable && <label className={styles.upload}>Заменить изображение<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={event => { void upload(field, event.target.files?.[0]); event.target.value = ''; }} /><small>JPG, PNG или WebP, до 10 МБ</small></label>}
              {effective(field, values) !== field.value && editable && <button disabled={busy} className={styles.textButton} onClick={() => update(field.key, field.value)}>Вернуть исходное значение</button>}</div>
            </div>)}</div>
          </details>)}
          <details className={styles.fieldSection}><summary>История и восстановление<span>{document.history.length}</span></summary><div className={styles.fields}><p>Последние 20 публикаций. Восстановление загружает предыдущую версию в черновик.</p>{document.history.map((version, index) => <div key={version.at} className={styles.historyRow}><span>До публикации {new Date(version.at).toLocaleString('ru-RU')} · {version.by}</span>{editable && <button disabled={busy} onClick={() => { setValues(version.values); setMessage(`Предыдущая версия загружена. Проверьте поля и сохраните черновик.`); }}>Восстановить версию {document.history.length - index}</button>}</div>)}{editable && <button disabled={busy || !changes.length} onClick={() => setConfirmation('reset')}>Вернуть опубликованную версию в редактор</button>}</div></details>
        </>}
      </section>
    </div>
    {dialog && <div className={styles.backdrop}><section className={styles.confirmation} role="dialog" aria-modal="true" aria-labelledby="cms-confirm-title" onKeyDown={event => { if (event.key === 'Escape' && !busy) { setConfirmation(null); setNextPage(null); } if (event.key === 'Tab') { const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if (event.shiftKey && globalThis.document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1]?.focus(); } else if (!event.shiftKey && globalThis.document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0]?.focus(); } } }}>
      <h2 id="cms-confirm-title">{nextPage ? 'Перейти без сохранения?' : confirmation === 'publish' ? 'Опубликовать изменения?' : 'Вернуть версию с сайта?'}</h2>
      <p>{nextPage ? 'Несохранённые правки этой страницы будут потеряны.' : confirmation === 'publish' ? `«${page.title}»: изменено полей — ${changes.length}. Новую версию увидят посетители сайта.` : 'Поля в редакторе будут заменены опубликованными значениями. Затем можно сохранить их в черновик.'}</p>
      {confirmation === 'publish' && <ul className={styles.changeList}>{changes.map(f => <li key={f.key}>{f.label}</li>)}</ul>}
      <div className={styles.actions}><button autoFocus disabled={busy} onClick={() => { setConfirmation(null); setNextPage(null); }}>Отмена</button><button className={styles.primary} disabled={busy} onClick={() => { if (nextPage) { setSelected(nextPage); setNextPage(null); } else if (confirmation === 'publish') void save(true); else { setValues(document?.published ?? {}); setConfirmation(null); } }}>{busy ? 'Сохраняем…' : nextPage ? 'Перейти' : confirmation === 'publish' ? 'Подтвердить публикацию' : 'Вернуть'}</button></div>
    </section></div>}
  </div>;
}
