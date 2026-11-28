import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { adminDirectory } from '../../../lib/admin-files';
export const dynamic = 'force-static';
export function generateStaticParams() { return process.env.PAGES_PREVIEW === '1' ? [{ name: 'unavailable' }] : []; }
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name)) return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(path.join(adminDirectory(), 'media', name));
    const type = name.endsWith('.jpg') ? 'jpeg' : name.split('.').at(-1);
    return new Response(bytes, { headers: { 'Content-Type': 'image/' + type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; return new Response(null, { status: 404 }); }
}
