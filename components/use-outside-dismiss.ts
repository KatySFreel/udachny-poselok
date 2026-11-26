"use client";

import { useEffect, useRef, type RefObject } from "react";

type Options = {
  enabled: boolean;
  refs: readonly RefObject<Element | null>[];
  onDismiss: () => void;
  ignore?: (target: Element) => boolean;
};

/** Dismiss on an outside tap, keeping scrolling, dragging and inside interactions intact. */
export function useOutsideDismiss(options: Options) {
  const latest = useRef(options);
  useEffect(() => { latest.current = options; });
  useEffect(() => {
    if (!options.enabled) return;
    let start: { id: number; x: number; y: number; outside: boolean } | null = null;
    function outside(target: EventTarget | null) {
      return target instanceof Element
        && !latest.current.refs.some(ref => ref.current?.contains(target))
        && !latest.current.ignore?.(target);
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      start = { id: event.pointerId, x: event.clientX, y: event.clientY, outside: outside(event.target) };
    }
    function up(event: PointerEvent) {
      const origin = start;
      start = null;
      if (origin?.id === event.pointerId && origin.outside && outside(event.target)
        && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) <= 8) {
        latest.current.onDismiss();
      }
    }
    function cancel() { start = null; }
    function click(event: MouseEvent) {
      if (event.detail === 0 && outside(event.target)) latest.current.onDismiss();
    }
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("click", click, true);
    };
  }, [options.enabled]);
}
