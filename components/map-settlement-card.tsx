"use client";
import { useCmsCopy } from "./cms-provider";


import { formatNumber } from "../lib/format-number";
import type { MapRoute } from '../lib/map-routes';
import type { Ref } from 'react';
import type { Settlement } from '../content/settlements';
import { sitePath } from '../lib/site-path';
import shared from './settlements.module.css';
import styles from './home-settlements-map.module.css';

export function MapSettlementCard({ settlement, routes, id, titleId, onClose, ref, className = '', position, href, pointer = true, showAction = true }: {
  settlement: Pick<Settlement,'slug' | 'name' | 'location' | 'price'>;
  routes: readonly MapRoute[];
  id?: string;
  titleId: string;
  onClose: () => void;
  ref?: Ref<HTMLElement>;
  className?: string;
  position?: 'above' | 'below';
  href?: string;
  pointer?: boolean;
  showAction?: boolean;
}) {
  const cms = useCmsCopy();

  const destination = href ?? sitePath(`/poselki/${settlement.slug}`);
  return <article ref={ref} className={`${styles.details} ${className}`} data-position={position} data-pointer={pointer ? undefined : 'false'} id={id} aria-labelledby={titleId}>
    <button type="button" className={styles.detailsClose} aria-label={cms.text("copy.map-settlement-card.1", "Закрыть информацию о посёлке")} onClick={onClose}><img src={sitePath('/icons/quiz/close.svg')} width={15.5} height={15.5} alt="" /></button>
    <a className={styles.cardPhoto} href={destination} tabIndex={-1} aria-hidden="true"><img src={sitePath(`/images/settlements/${settlement.slug}.webp`)} alt="" width={880} height={1200} loading="lazy" decoding="async" /></a>
    <a className={styles.summary} href={destination}>
      <p className={`${shared.location} ${styles.location}`}><img src={sitePath('/icons/settlement-location.svg')} width={13.125} height={16.8791} alt="" />{settlement.location}</p>
      <h3 className={`${shared.cardTitle} ${styles.title}`} id={titleId}>{settlement.name}</h3>
      <div className={`${shared.priceRow} ${styles.priceRow}`}><p>{cms.text("copy.map-settlement-card.2", "От ")}{formatNumber(settlement.price)} ₽</p>{showAction && <span className={shared.arrow} aria-hidden="true" />}</div>
    </a>
    <div className={styles.routes}><p>{cms.text("copy.map-settlement-card.3", "Проложить маршрут в приложении:")}</p><div className={styles.routeLinks}>{routes.map(route=><a key={route.icon} href={route.href} target="_blank" rel="noopener noreferrer" aria-label={`Открыть ${settlement.name} — ${route.label}`}><img src={sitePath(`/icons/settlements-map/${route.icon}.${route.icon==='google'?'webp':'svg'}`)} width={24} height={24} alt="" />{route.label}</a>)}</div></div>
  </article>;
}
