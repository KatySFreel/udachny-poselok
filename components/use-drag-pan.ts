"use client";

import { useRef, useState, type HTMLAttributes } from 'react';
import { useMediaQuery } from './use-media-query';

/** Mouse panning without hijacking the page wheel; ordinary clicks remain clicks. */
export function useDragPan() {
  const horizontalOnly = useMediaQuery('(width < 768px)');
  const [dragging, setDragging] = useState(false);
  const start = useRef<{x:number;y:number;left:number;top:number;moved:boolean} | null>(null);
  const suppressClick = useRef(false);
  const handlers: HTMLAttributes<HTMLDivElement> = {
    onPointerDown(event) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('button,a,input,label,select,textarea')) return;
      start.current = {x:event.clientX,y:event.clientY,left:event.currentTarget.scrollLeft,top:event.currentTarget.scrollTop,moved:false};
      suppressClick.current = false;
    },
    onPointerMove(event) {
      const origin = start.current;
      if (!origin || !(event.buttons & 1)) return;
      const dx = event.clientX-origin.x, dy = event.clientY-origin.y;
      if (!origin.moved && Math.abs(dx)+Math.abs(dy) <= 4) return;
      if (!origin.moved && horizontalOnly && Math.abs(dy) > Math.abs(dx)) {
        start.current = null;
        return;
      }
      if (!origin.moved) {
        origin.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      }
      event.currentTarget.scrollLeft = origin.left-dx;
      if (!horizontalOnly) event.currentTarget.scrollTop = origin.top-dy;
      event.preventDefault();
    },
    onPointerUp(event) {
      suppressClick.current = !!start.current?.moved;
      start.current = null;
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel() { start.current=null; suppressClick.current=false; setDragging(false); },
    onClickCapture(event) {
      if (!suppressClick.current) return;
      event.preventDefault(); event.stopPropagation(); suppressClick.current=false;
    },
    onKeyDown(event) {
      if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
      if (horizontalOnly && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) return;
      const delta: Record<string,[number,number]> = {ArrowLeft:[-80,0],ArrowRight:[80,0],ArrowUp:[0,-80],ArrowDown:[0,80]};
      const step = delta[event.key];
      if (step) { event.preventDefault(); event.currentTarget.scrollBy({left:step[0],top:step[1],behavior:'instant'}); }
    },
  };
  return { dragging, handlers };
}
