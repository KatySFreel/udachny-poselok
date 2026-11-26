import type { Metadata } from 'next';
import { sitePath } from './site-path';

export const canonicalUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;
export const indexable = Boolean(canonicalUrl) && process.env.PAGES_PREVIEW !== "1";
export const metadataBase = indexable ? canonicalUrl
  : process.env.PREVIEW_URL ? new URL(process.env.PREVIEW_URL) : undefined;

/** The shared canonical/Open Graph policy for static pages. */
export function createPageMetadata({title,description,path,siteName,image}: {
  title: string;
  description: string;
  path: string;
  siteName?: string;
  image?: {src:string;alt:string};
}): Metadata {
  return {
    title,description,
    ...(indexable && canonicalUrl ? {alternates:{canonical:new URL(path,canonicalUrl)}} : {}),
    openGraph:{
      ...(siteName ? {siteName} : {}),
      title,description,type:'website',locale:'ru_RU',
      ...(image && metadataBase ? {url:new URL(sitePath(path),metadataBase),images:[{url:new URL(sitePath(image.src),metadataBase),alt:image.alt}]} : {}),
    },
  };
}
