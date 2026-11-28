'use client';
import { useEffect, useState } from 'react';
import { adminUsers, adminChangeAccess } from '@admin-actions';
import { roles, type AccessUser, type AdminRole } from '../lib/admin-types';
import styles from './admin.module.css';
const statuses = { pending: 'Ждёт одобрения', approved: 'Доступ открыт', rejected: 'Заявка отклонена', revoked: 'Доступ отозван' };
const descriptions = { admin: 'Управление пользователями, публикация страниц и редактирование генпланов.', editor: 'Редактирование страниц и сохранение черновиков. Публикует администратор.', manager: 'Редактирование участков и очередей в генпланах.', viewer: 'Просмотр содержимого и генпланов без права сохранять изменения.' };
export function AdminUsers() {
  const [users, setUsers] = useState<AccessUser[] | null>(null), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Record<string, AdminRole>>({});
  const [confirmation, setConfirmation] = useState<{ user: AccessUser; role: AdminRole; status: 'approved' | 'rejected' | 'revoked' } | null>(null);
  useEffect(() => { adminUsers().then(setUsers).catch(() => setMessage('Не удалось загрузить пользователей.')); }, []);
  async function apply() { if (!confirmation) return; setBusy(true); try { const result = await adminChangeAccess(confirmation.user.id, confirmation.role, confirmation.status); setMessage(result.message); if (result.ok) { setUsers(await adminUsers()); setConfirmation(null); } } catch { setMessage('Не удалось изменить доступ. Повторите попытку.'); } finally { setBusy(false); } }
  return <div className={styles.content}>
    <header className={styles.pageHeader}><div><p className={styles.eyebrow}>Команда</p><h1>Пользователи и доступы</h1><p>Новые пользователи подают заявку на странице входа. Вы проверяете её и назначаете роль.</p></div></header>
    <section className={styles.roleList} aria-label="Возможности ролей">{Object.entries(roles).map(([key, name]) => <div key={key}><h2>{name}</h2><p>{descriptions[key as AdminRole]}</p></div>)}</section>
    <div role="status" className={styles.message}>{message}</div>
    <h2>Заявки и участники{users ? ` · ${users.length}` : ''}</h2>
    {!users ? <p>Загружаем…</p> : !users.length ? <div className={styles.empty}><h3>Заявок пока нет</h3><p>Попросите сотрудника открыть админку и нажать «Запросить доступ».</p></div> : <div className={styles.users}>{[...users].sort((a,b) => Number(b.status === 'pending') - Number(a.status === 'pending')).map(user => <article className={styles.userRow} key={user.id}>
      <div><h3>{user.name}</h3><p>{user.email}</p><small>{statuses[user.status]} · {new Date(user.requestedAt).toLocaleDateString('ru-RU')}</small></div>
      <label>Роль для {user.name}<select value={selected[user.id] ?? user.role} onChange={event => setSelected({ ...selected, [user.id]: event.target.value as AdminRole })}>{Object.entries(roles).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label>
      <div className={styles.actions}><button className={styles.primary} onClick={() => setConfirmation({ user, role: selected[user.id] ?? user.role, status: 'approved' })}>{user.status === 'approved' ? 'Изменить роль' : 'Одобрить доступ'}</button><button onClick={() => setConfirmation({ user, role: user.role, status: user.status === 'pending' ? 'rejected' : 'revoked' })}>{user.status === 'pending' ? 'Отклонить' : 'Отозвать доступ'}</button></div>
    </article>)}</div>}
    {confirmation && <div className={styles.backdrop}><section className={styles.confirmation} role="dialog" aria-modal="true" aria-labelledby="access-confirm-title" onKeyDown={event => { if (event.key === 'Escape' && !busy) setConfirmation(null); if (event.key === 'Tab') { const elements = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements[elements.length - 1]?.focus(); } else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) { event.preventDefault(); elements[0]?.focus(); } } }}>
      <h2 id="access-confirm-title">{confirmation.status === 'approved' ? 'Подтвердить доступ?' : 'Закрыть доступ?'}</h2><p>{confirmation.user.name} · {confirmation.user.email}</p>
      <p>{confirmation.status === 'approved' ? `${roles[confirmation.role]}. ${descriptions[confirmation.role]}` : 'Пользователь не сможет войти. Его действующие сеансы будут завершены.'}</p><p>При изменении роли пользователь войдёт заново с обновлёнными правами.</p>
      <p role="status">{message}</p><div className={styles.actions}><button autoFocus disabled={busy} onClick={() => setConfirmation(null)}>Отмена</button><button className={styles.primary} disabled={busy} onClick={apply}>{busy ? 'Сохраняем…' : 'Подтвердить'}</button></div>
    </section></div>}
  </div>;
}
