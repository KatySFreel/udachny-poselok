import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete('x-admin-preview');
  const preview = request.nextUrl.searchParams.get('admin-preview');
  if (preview && /^[a-z0-9-]{1,100}$/.test(preview)) headers.set('x-admin-preview', preview);
  const response = NextResponse.next({ request: { headers } });
  if (preview) { response.headers.set('X-Robots-Tag', 'noindex, nofollow'); response.headers.set('Cache-Control', 'private, no-store'); }
  return response;
}
export const config = { matcher: ['/((?!_next|admin-media|images|icons|.*\\.[a-zA-Z0-9]+$).*)'] };
