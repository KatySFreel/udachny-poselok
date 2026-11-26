"use client";
import type { ReactNode } from 'react';

/** Shared limits and buttons; each map retains its own visual style and extras. */
export function ZoomControls({value,min = 1,max,step,onChange,increaseLabel,decreaseLabel,label,className,children}: {
  value: number;
  min?: number;
  max: number;
  step: number;
  onChange: (value:number) => void;
  increaseLabel: string;
  decreaseLabel: string;
  label?: string;
  className: string;
  children?: ReactNode;
}) {
  const change = (direction:number) => onChange(Math.min(max,Math.max(min,+(value+direction*step).toFixed(2))));
  return <div className={className} aria-label={label}>
    <button type="button" aria-label={increaseLabel} disabled={value>=max} onClick={() => change(1)}>+</button>
    <button type="button" aria-label={decreaseLabel} disabled={value<=min} onClick={() => change(-1)}>−</button>
    {children}
  </div>;
}
