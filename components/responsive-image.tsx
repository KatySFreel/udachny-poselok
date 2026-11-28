import type { ComponentPropsWithoutRef } from 'react';
import images from '../content/responsive-images.json';
import { sitePath } from '../lib/site-path';

const variants: Record<string, readonly {src: string; width: number}[]> = images;

/** One image element preserves existing layout and falls back for CMS uploads. */
export function ResponsiveImage({src,sizes = '100vw',...props}: Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'srcSet'> & {src: string}) {
  const sources = variants[src];
  return <img {...props} src={sitePath(src)}
    srcSet={sources?.map(image => `${sitePath(image.src)} ${image.width}w`).join(', ')}
    sizes={sources ? sizes : undefined} />;
}
