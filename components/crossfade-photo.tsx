"use client";

import { sitePath } from '../lib/site-path';
import styles from './house-project.module.css';

/** Keep both photographs mounted so the outgoing frame remains during the dissolve. */
export function CrossfadePhoto({photos,selected,alt,width,height,mobileSource,priority = false}: {
  photos: readonly string[];
  selected: number;
  alt: string;
  width: number;
  height: number;
  mobileSource?: string;
  priority?: boolean;
}) {
  return <div className={styles.photoSlides}>
    {photos.map((src,index) => <picture key={src} className={styles.photoSlide} data-active={index === selected || undefined} aria-hidden={index !== selected || undefined}>
      {mobileSource && <source media="(width < 768px)" srcSet={sitePath(mobileSource)} />}
      <img src={sitePath(src)} alt={index === selected ? alt : ''} width={width} height={height}
        loading={index === selected ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority && index === 0 ? 'high' : undefined} />
    </picture>)}
  </div>;
}
