import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
export const adminDirectory = () => process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), '.data', 'admin');
export async function readAdminFile<T>(name: string, fallback: T): Promise<T> {
  try { return JSON.parse(await readFile(path.join(adminDirectory(), name + '.json'), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(fallback); throw error; }
}
export async function writeAdminFile(name: string, data: unknown) {
  await mkdir(adminDirectory(), { recursive: true });
  const target = path.join(adminDirectory(), name + '.json');
  const temporary = target + '.' + randomUUID() + '.tmp';
  await writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
  await rename(temporary, target);
}
const queues = new Map<string, Promise<unknown>>();
export function adminTransaction<T>(name: string, operation: () => Promise<T>): Promise<T> {
  const next = (queues.get(name) ?? Promise.resolve()).then(operation);
  queues.set(name, next.catch(() => {}));
  return next;
}
