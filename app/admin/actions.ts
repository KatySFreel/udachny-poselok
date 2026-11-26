'use server';
import { revalidatePath } from 'next/cache';
import { currentAdmin, loginAdminAccount, logoutAdminAccount, ownerPassword, requestAdminAccess, listAccessUsers, changeAccess } from '../../lib/admin-auth';
import { canEditContent, type AdminRole, type AccessUser } from '../../lib/admin-types';
import { readCmsDocument, persistCmsDocument } from '../../lib/cms-store';
import { cmsPages } from '../../lib/cms-catalog';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { adminDirectory } from '../../lib/admin-files';
export async function adminAccess() { return { user: await currentAdmin(), configured: !!ownerPassword(), staticPreview: false }; }
export async function adminLogin(email: string, password: string) { return loginAdminAccount(email, password); }
export async function adminLogout() { return logoutAdminAccount(); }
export async function adminRequestAccess(name: string, email: string, password: string) { return requestAdminAccess(name, email, password); }
export async function adminUsers() { return listAccessUsers(); }
export async function adminChangeAccess(id: string, role: AdminRole, status: AccessUser['status']) { return changeAccess(id, role, status); }
export async function adminReadPage(id: string) {
  const actor = await currentAdmin();
  if (!actor || actor.role === 'manager') throw new Error('Нет доступа к содержимому страниц.');
  return readCmsDocument(id);
}
export async function adminSavePage(id: string, revision: number, values: unknown, publish: boolean) {
  const actor = await currentAdmin();
  if (!actor || !canEditContent(actor.role) || (publish && actor.role !== 'admin')) return { ok: false as const, message: 'Недостаточно прав для этого действия.' };
  const result = await persistCmsDocument(id, revision, values, publish, actor.name);
  if (result.ok && publish) revalidatePath('/', 'layout');
  return result;
}
export async function adminPageSummaries() {
  const actor = await currentAdmin();
  if (!actor || actor.role === 'manager') return [];
  return Promise.all(cmsPages.map(async page => {
    const doc = await readCmsDocument(page.id);
    return { id: page.id, updatedAt: doc.updatedAt, updatedBy: doc.updatedBy, publishedAt: doc.publishedAt, hasDraft: JSON.stringify(doc.draft) !== JSON.stringify(doc.published) };
  }));
}
export async function adminUploadImage(data: FormData) {
  const actor = await currentAdmin();
  if (!actor || !canEditContent(actor.role)) return { ok: false as const, message: 'Нет доступа к загрузке изображений.' };
  const file = data.get('file');
  if (!(file instanceof File) || file.size > 10_000_000 || file.size < 12) return { ok: false as const, message: 'Выберите JPG, PNG или WebP до 10 МБ.' };
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'jpg' : bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP' ? 'webp' : null;
  if (!extension) return { ok: false as const, message: 'Формат не подходит. Загрузите JPG, PNG или WebP.' };
  const name = randomUUID() + '.' + extension;
  const directory = path.join(adminDirectory(), 'media');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes, { mode: 0o600, flag: 'wx' });
  return { ok: true as const, url: '/admin-media/' + name };
}
