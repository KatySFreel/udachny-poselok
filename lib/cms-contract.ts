export type CmsValue = string | number;
export type CmsField = { key: string; label: string; section: string; kind: 'text' | 'image' | 'link' | 'number'; value: CmsValue };
export type CmsPage = { id: string; title: string; path: string; group: string; fields: CmsField[] };
export type CmsValues = Record<string, CmsValue>;
export type CmsDocument = { id: string; revision: number; draft: CmsValues; published: CmsValues; updatedAt?: string; updatedBy?: string; publishedAt?: string; history: { at: string; by: string; values: CmsValues }[] };
export function createCopy(values: CmsValues) {
  const keys = Object.keys(values);
  return {
    has: (key: string) => Object.hasOwn(values, key),
    imageSet: (key: string, fallback: string | undefined) => Object.hasOwn(values, key) ? undefined : fallback,
    text: (key: string, fallback: string) => typeof values[key] === 'string' ? values[key] as string : fallback,
    data: <T,>(namespace: string, value: T): T => {
      function visit(item: unknown, key: string): unknown {
        if (Object.hasOwn(values, key)) return values[key];
        if (!keys.some(candidate => candidate.startsWith(key + "."))) return item;
        if (Array.isArray(item)) return item.map((entry, index) => visit(entry, `${key}.${index}`));
        if (item && typeof item === 'object') {
          const result = Object.fromEntries(Object.entries(item).map(([name, entry]) => [name, visit(entry, `${key}.${name}`)]));
          for (const candidate of keys) {
            if (!candidate.startsWith(key + '.')) continue;
            const name = candidate.slice(key.length + 1);
            if (!name.includes('.') && !Object.hasOwn(result, name)) result[name] = values[candidate];
          }
          return result;
        }
        return item;
      }
      return visit(value, namespace) as T;
    },
  };
}
export function validateCmsValues(page: CmsPage, input: unknown): input is CmsValues {
  if (!input || typeof input !== 'object' || Array.isArray(input) || JSON.stringify(input).length > 1_000_000) return false;
  const fields = new Map(page.fields.map(f => [f.key, f]));
  return Object.entries(input).every(([key, value]) => {
    const field = fields.get(key);
    if (!field) return false;
    if (field.kind === 'number') return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e12;
    if (typeof value !== 'string' || value.length > 15000) return false;
    if (field.kind === 'image') return /^\/(?:images|icons|admin-media)\/[a-zA-Z0-9_./%+-]+$/.test(value) && !value.includes('..');
    if (key === 'data.site.office.mapEmbedHref' && !/^https:\/\/yandex\.(ru|com)\/map-widget\/v1\//.test(value)) return false;
    if (field.kind === 'link') return value === '' || /^(?:\/(?!\/)|#|https:\/\/|tel:\+7|mailto:)[^\s<>"']*$/.test(value);
    return true;
  });
}
