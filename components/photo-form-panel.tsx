import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { sitePath, siteSrcSet } from '../lib/site-path';
import styles from './photo-form-panel.module.css';

type PanelImage = Pick<ComponentPropsWithoutRef<'img'>,'alt' | 'width' | 'height' | 'decoding'> & {
  src: string;
  sources?: readonly {media:string;srcSet:string}[];
};
export function PhotoFormPanel({image,intro,children,variant,photoCaption,panelClassName = '',photoClassName = '',reveal = false}: {
  image: PanelImage;
  intro: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'about' | 'centered' | 'office' | 'personal-link' | 'construction' | 'presentation';
  photoCaption?: ReactNode;
  panelClassName?: string;
  photoClassName?: string;
  reveal?: boolean;
}) {
  const {sources,src,...imageProps} = image;
  const Photo = sources ? 'picture' : 'div';
  return <div className={styles.frame} data-variant={variant} data-reveal={reveal || undefined}>
    <Photo className={`${styles.photo} ${photoClassName}`}>
      {sources?.map(source => <source key={source.media} media={source.media} srcSet={siteSrcSet(source.srcSet)} />)}
      <img {...imageProps} src={sitePath(src)} loading="lazy" />
      {photoCaption && <div className={styles.photoCaption}>{photoCaption}</div>}
    </Photo>
    <div className={`${styles.panel} ${panelClassName}`}>
      <div className={styles.intro}>{intro}</div>
      {children}
    </div>
  </div>;
}
