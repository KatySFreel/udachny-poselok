'use client';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminAccess, adminLogin, adminLogout, adminRequestAccess } from '@admin-actions';
import { roles, type AdminIdentity } from '../lib/admin-types';
import { sitePath } from '../lib/site-path';
import styles from './admin.module.css';
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [unsaved, setUnsaved] = useState(false);
  const [access, setAccess] = useState<Awaited<ReturnType<typeof adminAccess>> | null>(null);
  const [mode, setMode] = useState<'login' | 'request'>('login');
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  useEffect(() => { adminAccess().then(setAccess).catch(() => setMessage('Не удалось проверить доступ. Обновите страницу.')); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setMessage('');
    try {
      const result = mode === 'login' ? await adminLogin(String(data.get('email')), String(data.get('password'))) : await adminRequestAccess(String(data.get('name')), String(data.get('email')), String(data.get('password')));
      setMessage(result.message);
      if (result.ok && mode === 'login') setAccess(await adminAccess());
      if (result.ok) (event.target as HTMLFormElement).reset();
    } catch { setMessage('Не удалось выполнить действие. Повторите попытку.'); } finally { setBusy(false); }
  }
  if (!access?.user) return <div className={styles.login}>
    <a href={sitePath('/')}>Удачный посёлок</a><p className={styles.eyebrow}>Управление сайтом</p>
    <h1>{mode === 'login' ? 'Вход в админку' : 'Заявка на доступ'}</h1>
    {!access ? <p role="status">{message || 'Проверяем доступ…'}</p> : access.staticPreview ? <p>Админка работает в серверной версии сайта.</p> : !access.configured ? <p>Вход ещё не настроен. На сервере нужно задать пароль владельца.</p> : <>
      <p>{mode === 'login' ? 'Войдите с учётной записью, одобренной администратором. Для владельца логин — admin.' : 'Укажите рабочую почту. Администратор проверит заявку и назначит роль. Почта используется как логин.'}</p>
      <form onSubmit={submit}>
        {mode === 'request' && <label>Имя<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>}
        <label>{mode === 'login' ? 'Почта или логин' : 'Рабочая почта'}<input name="email" type={mode === 'request' ? 'email' : 'text'} required maxLength={200} autoComplete="username" defaultValue={mode === 'login' ? 'admin' : ''} key={mode} /></label>
        <label>Пароль<input name="password" type="password" required minLength={mode === 'request' ? 12 : 1} maxLength={200} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {mode === 'request' && <small>Не менее 12 символов. Доступ появится только после одобрения.</small>}
        <button className={styles.primary} disabled={busy}>{busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Отправить заявку'}</button>
      </form>
      <p role="status">{message}</p><button className={styles.textButton} onClick={() => { setMode(mode === 'login' ? 'request' : 'login'); setMessage(''); }}>{mode === 'login' ? 'Запросить доступ' : 'Вернуться ко входу'}</button>
    </>}
  </div>;
  const user = access.user;
  const denied = pathname.includes('/dostupy') && user.role !== 'admin' || pathname.includes('/stranitsy') && user.role === 'manager' || pathname.includes('/genplany') && user.role === 'editor';
  return <AdminIdentityProvider user={user}><UnsavedContext.Provider value={setUnsaved}><div className={styles.workspace}>
    <aside className={styles.sidebar}>
      <a className={styles.brand} href={sitePath('/')}>Удачный<br />посёлок</a><span className={styles.eyebrow}>Управление сайтом</span>
      <nav aria-label="Разделы админки">
        {user.role !== 'manager' && <Link onNavigate={event => { if (unsaved && !window.confirm("Перейти без сохранения правок?")) event.preventDefault(); }} href="/admin/stranitsy" aria-current={pathname.includes('/stranitsy') || pathname === '/admin' ? 'page' : undefined}>Страницы и контент</Link>}
        {user.role !== 'editor' && <Link onNavigate={event => { if (unsaved && !window.confirm("Перейти без сохранения правок?")) event.preventDefault(); }} href="/admin/genplany" aria-current={pathname.includes('/genplany') ? 'page' : undefined}>Генпланы и участки</Link>}
        {user.role === 'admin' && <Link onNavigate={event => { if (unsaved && !window.confirm("Перейти без сохранения правок?")) event.preventDefault(); }} href="/admin/dostupy" aria-current={pathname.includes('/dostupy') ? 'page' : undefined}>Пользователи и доступы</Link>}
      </nav>
      <div className={styles.account}><strong>{user.name}</strong><span>{roles[user.role]}</span><button onClick={async () => { if (unsaved && !window.confirm("Выйти без сохранения правок?")) return; setBusy(true); try { await adminLogout(); setAccess(await adminAccess()); } catch { setMessage('Не удалось выйти. Повторите.'); } finally { setBusy(false); } }} disabled={busy}>Выйти</button><span role="status">{message}</span></div>
    </aside>
    <div className={styles.main}>{denied ? <div className={styles.content}><h1>Недостаточно прав</h1><p>Этот раздел недоступен вашей роли. Обратитесь к администратору.</p></div> : children}</div>
  </div></UnsavedContext.Provider></AdminIdentityProvider>;
}
import { createContext, useContext } from 'react';
const Identity = createContext<AdminIdentity | null>(null);
function AdminIdentityProvider({ user, children }: { user: AdminIdentity; children: ReactNode }) { return <Identity.Provider value={user}>{children}</Identity.Provider>; }
export function useAdminIdentity() { const user = useContext(Identity); if (!user) throw new Error('Admin identity missing'); return user; }

const UnsavedContext = createContext<(dirty: boolean) => void>(() => {});
export function useAdminUnsaved(dirty: boolean) { const setUnsaved = useContext(UnsavedContext); useEffect(() => { setUnsaved(dirty); return () => setUnsaved(false); }, [dirty, setUnsaved]); }
