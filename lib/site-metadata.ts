import type { Metadata } from 'next';
import { sitePath } from './site-path';
import type { createCopy } from './cms-contract';

export const canonicalUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
export const indexable = Boolean(canonicalUrl) && process.env.PAGES_PREVIEW !== "1";
export const metadataBase = indexable ? canonicalUrl
  : process.env.PREVIEW_URL ? new URL(process.env.PREVIEW_URL) : undefined;

/** The shared canonical/Open Graph policy for static pages. */
export function createPageMetadata({title,description,path,siteName = 'Удачный посёлок',image = {src:'/images/home-aerial-1440.webp',alt:'Коттеджный посёлок в Ленинградской области с высоты'}}: {
  title: string;
  description: string;
  path: string;
  siteName?: string;
  image?: {src:string;alt:string};
}): Metadata {
  const url = metadataBase ? new URL(sitePath(path), metadataBase) : undefined;
  const images = metadataBase ? [{url:new URL(sitePath(image.src),metadataBase),alt:image.alt}] : undefined;
  return {
    title,description,
    ...(indexable && canonicalUrl ? {alternates:{canonical:new URL(path,canonicalUrl)}} : {}),
    openGraph:{
      siteName,
      title,description,type:'website',locale:'ru_RU',
      url,images,
    },
    twitter: {card:'summary_large_image',title,description,images},
  };
}

/** Keep CMS overrides identical in search results and social previews. */
export function localizePageMetadata(metadata: Metadata, copy: Pick<ReturnType<typeof createCopy>, 'text'>, namespace: string): Metadata {
  const title = copy.text(`seo.${namespace}.title`, typeof metadata.title === 'string' ? metadata.title : '');
  const description = copy.text(`seo.${namespace}.description`, metadata.description ?? '');
  return {...metadata,title,description,
    openGraph:{...metadata.openGraph,title,description},
    twitter:{...metadata.twitter,title,description},
  };
}
