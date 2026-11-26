import { headers } from 'next/headers';
import { currentAdmin } from './admin-auth';
import { cmsPages } from './cms-catalog';
import { cache } from 'react';
import { adminTransaction, readAdminFile, writeAdminFile } from './admin-files';
import { createCopy, validateCmsValues, type CmsDocument, type CmsValues } from './cms-contract';
export function initialCmsDocument(id: string): CmsDocument { return { id, revision: 0, draft: {}, published: {}, history: [] }; }
export async function readCmsDocument(id: string) {
  if (!cmsPages.some(p => p.id === id)) throw new Error('Страница не найдена');
  if (process.env.PAGES_PREVIEW === '1') return initialCmsDocument(id);
  return readAdminFile('content-' + id, initialCmsDocument(id));
}
export async function persistCmsDocument(id: string, revision: number, values: unknown, publish: boolean, actor: string) {
  const page = cmsPages.find(p => p.id === id);
  if (!page || !Number.isSafeInteger(revision) || !validateCmsValues(page, values)) return { ok: false as const, message: 'Проверьте поля страницы, ссылки и изображения.' };
  const normalized = Object.fromEntries(Object.entries(values).filter(([key, value]) => page.fields.find(field => field.key === key)?.value !== value).sort(([a], [b]) => a.localeCompare(b)));
  return adminTransaction('content-' + id, async () => {
    const current = await readCmsDocument(id);
    if (current.revision !== revision) return { ok: false as const, message: 'Страница изменена другим пользователем. Скопируйте свои правки и загрузите свежую версию.', conflict: true };
    const now = new Date().toISOString();
    const document: CmsDocument = { ...current, revision: revision + 1, draft: normalized, updatedAt: now, updatedBy: actor,
      ...(publish ? { published: normalized, publishedAt: now, history: [{ at: now, by: actor, values: current.published }, ...current.history].slice(0, 20) } : {}) };
    await writeAdminFile('content-' + id, document);
    return { ok: true as const, document, message: publish ? 'Изменения опубликованы.' : 'Черновик сохранён. Сайт пока не изменился.' };
  });
}
export const cmsPreviewPage = cache(async () => {
  if (process.env.PAGES_PREVIEW === '1') return null;
  const id = (await headers()).get('x-admin-preview');
  if (!id || !cmsPages.some(p => p.id === id)) return null;
  const user = await currentAdmin();
  return user && user.role !== 'manager' ? cmsPages.find(p => p.id === id)! : null;
});
export const publishedCmsValues = cache(async (): Promise<CmsValues> => {
  const preview = await cmsPreviewPage();
  const documents = await Promise.all(cmsPages.map(page => readCmsDocument(page.id)));
  return Object.assign({}, ...documents.map(document => document.id === preview?.id ? document.draft : document.published));
});
export async function getCmsCopy() { return createCopy(await publishedCmsValues()); }
