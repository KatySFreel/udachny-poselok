import { sitePath } from '../lib/site-path';

/** Decorative overlapping thumbnails; each card owns its sizing and shape. */
export function ImageStack({images,className,size = 144}: {images:readonly string[];className:string;size?:number}) {
  return <div className={className}>{images.map(src => <img key={src} src={sitePath(src)} alt="" width={size} height={size} loading="lazy" />)}</div>;
}
