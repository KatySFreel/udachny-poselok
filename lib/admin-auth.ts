import { createHash, createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { adminTransaction, readAdminFile, writeAdminFile } from './admin-files';
import { roles, type AccessUser, type AdminIdentity, type AdminRole } from './admin-types';
const scrypt = promisify(scryptCallback);
const cookieName = 'site-admin-session';
export const ownerPassword = () => process.env.ADMIN_OWNER_PASSWORD || process.env.PLAN_ADMIN_PASSWORD || '';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const same = (a: string, b: string) => timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));
type User = AccessUser & { passwordHash: string };
type State = { users: User[]; sessions: { token: string; userId: string; expires: number; credential?: string }[]; attempts: Record<string, { count: number; until: number }> };
const empty: State = { users: [], sessions: [], attempts: {} };
const owner: AdminIdentity = { id: 'owner', name: 'Владелец сайта', email: 'admin', role: 'admin' };
export const publicUser = ({ id, name, email, role, status, requestedAt, approvedBy }: User): AccessUser => ({ id, name, email, role, status, requestedAt, approvedBy });
export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  return salt + ':' + (await scrypt(password, salt, 64) as Buffer).toString('hex');
}
async function verify(password: string, stored: string) {
  const [salt, digest] = stored.split(':');
  return !!salt && !!digest && same((await scrypt(password, salt, 64) as Buffer).toString('hex'), digest);
}
export async function currentAdmin(): Promise<AdminIdentity | null> {
  if (!ownerPassword() || process.env.PAGES_PREVIEW === '1') return null;
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) {
    const state = await readAdminFile('access', empty);
    const session = state.sessions.find(s => s.token === hash(token) && s.expires > Date.now());
    if (session?.userId === 'owner') return session.credential === hash(ownerPassword()) ? owner : null;
    const user = state.users.find(u => u.id === session?.userId && u.status === 'approved');
    return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
  }
  // Honour the existing local owner's signed session while moving to named accounts.
  const old = jar.get('settlement-plan-admin')?.value?.split('.') ?? [];
  if (process.env.PLAN_ADMIN_PASSWORD && old.length === 3 && Number(old[0]) > Date.now() && Number(old[0]) < Date.now() + 8 * 3600_000 && same(old[2], createHmac('sha256', process.env.PLAN_ADMIN_PASSWORD ?? '').update(old.slice(0, 2).join('.')).digest('hex'))) return owner;
  return null;
}
export async function loginAdminAccount(email: string, password: string) {
  if (!ownerPassword()) return { ok: false, message: 'Доступ ещё не настроен на сервере.' };
  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 200 || password.length > 500) return { ok: false, message: 'Проверьте данные входа.' };
  const identity = email.trim().toLowerCase();
  const result = await adminTransaction('access', async () => {
    const state = await readAdminFile('access', empty);
    const key = hash(identity), attempt = state.attempts[key];
    if (attempt && attempt.until > Date.now()) return { ok: false as const, message: 'Слишком много попыток. Повторите через 15 минут.' };
    const user = state.users.find(u => u.email === identity);
    const valid = identity === 'admin' ? same(password, ownerPassword()) : await verify(password, user?.passwordHash ?? 'unavailable:unavailable');
    if (!valid || (identity !== 'admin' && user?.status !== 'approved')) {
      const count = (attempt?.count ?? 0) + 1;
      state.attempts[key] = { count: count >= 10 ? 0 : count, until: count >= 10 ? Date.now() + 900_000 : 0 };
      await writeAdminFile('access', state);
      return { ok: false as const, message: 'Неверные данные или доступ ещё не одобрен.' };
    }
    delete state.attempts[key];
    const token = randomBytes(32).toString('hex');
    state.sessions = state.sessions.filter(s => s.expires > Date.now());
    state.sessions.push({ token: hash(token), userId: identity === 'admin' ? 'owner' : user!.id, expires: Date.now() + 8 * 3600_000, ...(identity === 'admin' ? { credential: hash(ownerPassword()) } : {}) });
    await writeAdminFile('access', state);
    return { ok: true as const, token, message: '' };
  });
  if (result.ok) (await cookies()).set(cookieName, result.token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 8 * 3600 });
  return { ok: result.ok, message: result.message };
}
export async function logoutAdminAccount() {
  const jar = await cookies(), token = jar.get(cookieName)?.value;
  if (token) await adminTransaction('access', async () => { const state = await readAdminFile('access', empty); state.sessions = state.sessions.filter(s => s.token !== hash(token)); await writeAdminFile('access', state); });
  jar.delete(cookieName); jar.delete('settlement-plan-admin');
}
export async function requestAdminAccess(name: string, email: string, password: string) {
  if (!ownerPassword()) return { ok: false, message: 'Доступ ещё не настроен.' };
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || name.trim().length < 2 || name.length > 100 || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 200) return { ok: false, message: 'Укажите имя, корректную почту и пароль от 12 до 200 символов.' };
  return adminTransaction('access', async () => {
    const state = await readAdminFile('access', empty);
    if (!state.users.some(u => u.email === email.trim().toLowerCase())) {
      if (state.users.length >= 500) return { ok: false, message: 'Лимит заявок. Обратитесь к администратору.' };
      state.users.push({ id: randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), role: 'viewer', status: 'pending', requestedAt: new Date().toISOString(), passwordHash: await passwordHash(password) });
      await writeAdminFile('access', state);
    }
    return { ok: true, message: 'Заявка отправлена. Войти можно после одобрения администратором.' };
  });
}
export async function listAccessUsers() {
  if ((await currentAdmin())?.role !== 'admin') throw new Error('Нет доступа');
  return (await readAdminFile('access', empty)).users.map(publicUser);
}
export async function changeAccess(id: string, role: AdminRole, status: AccessUser['status']) {
  const actor = await currentAdmin();
  if (actor?.role !== 'admin' || !Object.hasOwn(roles, role) || !['approved', 'rejected', 'revoked'].includes(status)) return { ok: false, message: 'Недостаточно прав.' };
  return adminTransaction('access', async () => {
    const state = await readAdminFile('access', empty), user = state.users.find(u => u.id === id);
    if (!user || user.id === actor.id) return { ok: false, message: 'Нельзя изменить собственный доступ.' };
    user.role = role; user.status = status; user.approvedBy = actor.name;
    state.sessions = state.sessions.filter(s => s.userId !== id);
    await writeAdminFile('access', state);
    return { ok: true, message: status === 'approved' ? 'Доступ подтверждён.' : 'Доступ закрыт.' };
  });
}
