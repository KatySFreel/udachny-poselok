import type { ReactNode } from 'react';
import styles from './looping-carousel-track.module.css';

/** Three identical cycles are the DOM contract of useLoopingCarousel. */
export function LoopingCarouselTrack({as:Slides = 'div',slidesClassName = '',children}: {
  as?: 'div' | 'ul';
  slidesClassName?: string;
  children: (original:boolean) => ReactNode;
}) {
  return <div className={styles.row}>
    {['before','original','after'].map(copy => <Slides key={copy} className={`${styles.slides} ${slidesClassName}`} aria-hidden={copy !== 'original' || undefined}>{children(copy === 'original')}</Slides>)}
  </div>;
}
