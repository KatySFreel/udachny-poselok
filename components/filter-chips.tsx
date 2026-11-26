"use client";

import styles from './settlements.module.css';

export function FilterChips<T extends string>({items,value,onChange,label,controls,className = '',wrapOnTablet}: {
  items: readonly {id:T;label:string;disabled?:boolean}[];
  value: T;
  onChange: (value:T) => void;
  label: string;
  controls: string;
  className?: string;
  wrapOnTablet?: boolean;
}) {
  return <div className={`${styles.filters} ${className}`} data-wrap-on-tablet={wrapOnTablet || undefined} role="group" aria-label={label}>
    {items.map(item => <button key={item.id} type="button" className={styles.chip} aria-controls={controls} aria-pressed={value === item.id} disabled={item.disabled} onClick={() => onChange(item.id)}>{item.label}</button>)}
  </div>;
}
