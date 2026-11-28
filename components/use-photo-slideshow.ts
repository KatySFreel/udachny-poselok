"use client";

import { useEffect, useReducer, useState, type RefObject } from 'react';

/** Shared autoplay for photo galleries; manual choices restart the interval. */
export function usePhotoSlideshow({container,count,enabled = true,delay = 5000}: {
  container: RefObject<HTMLElement | null>;
  count: number;
  enabled?: boolean;
  delay?: number;
}) {
  const [selected,setSelected] = useState(0);
  const [interaction,restart] = useReducer(value => value + 1,0);

  useEffect(() => {
    const element = container.current;
    if (!element || !enabled || count < 2) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: number | undefined;
    function schedule() {
      window.clearTimeout(timer);
      if (!visible || document.hidden || motion.matches || element?.querySelector(':focus-visible')) return;
      timer = window.setTimeout(() => setSelected(current => (current + 1) % count),delay);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    },{threshold:0.2});
    observer.observe(element);
    document.addEventListener('visibilitychange',schedule);
    element.addEventListener('focusin',schedule);
    element.addEventListener('focusout',schedule);
    motion.addEventListener('change',schedule);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange',schedule);
      element.removeEventListener('focusin',schedule);
      element.removeEventListener('focusout',schedule);
      motion.removeEventListener('change',schedule);
    };
  },[container,count,delay,enabled,selected,interaction]);

  function select(index: number) { setSelected(index);restart(); }
  function move(direction: number) { setSelected(current => (current + direction + count) % count);restart(); }
  return {selected,select,move};
}
