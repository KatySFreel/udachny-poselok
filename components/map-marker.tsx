import type { ComponentPropsWithRef, ReactNode } from 'react';
import { sitePath } from '../lib/site-path';
import styles from './home-settlements-map.module.css';

type MapMarkerProps = Omit<ComponentPropsWithRef<'button'>,'children'> & {
  label: ReactNode;
  labelClassName?: string;
  pinClassName?: string;
  badge?: ReactNode;
};
export function MapMarker({label,labelClassName = '',pinClassName = '',badge,className = '',...props}: MapMarkerProps) {
  return <button type="button" {...props} className={`${styles.marker} ${className}`}>
    <span className={`${styles.pin} ${pinClassName}`}>
      <img src={sitePath('/icons/settlements-map/home.svg')} width={32} height={32} alt="" draggable={false} />
      {badge}
    </span>
    <span className={`${styles.markerLabel} ${labelClassName}`}>{label}</span>
  </button>;
}
