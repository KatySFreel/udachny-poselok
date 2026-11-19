"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";

/** Shared timing, responsive measurement, and seamless wrap for the site's carousels. */
export function useLoopingCarousel({ count, delay, pauseOnHover = true, transitionDuration = 0 }: {
  count: number;
  delay: number;
  pauseOnHover?: boolean;
  transitionDuration?: number;
}) {
  const carousel = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const move = useRef<(direction: number) => void>(() => {});

  useLayoutEffect(() => {
    const rail = viewport.current;
    const slider = carousel.current;
    const row = rail?.firstElementChild;
    if (!rail || !slider || !row || count < 2) return;
    const [before, original] = Array.from(row.children) as HTMLElement[];
    if (!before || !original) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = matchMedia("(width >= 768px) and (hover: hover) and (pointer: fine)");
    let cycle = 0;
    let inView = false;
    let touching = false;
    let hovered = false;
    let target: number | undefined;
    let autoplayTimer: number;
    let settleTimer: number;
    let animationFrame = 0;
    const scrollSnapType = rail.style.scrollSnapType;

    function stopAnimation() {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      rail!.style.scrollSnapType = scrollSnapType;
    }

    function measure() {
      const nextCycle = original.getBoundingClientRect().left - before.getBoundingClientRect().left;
      if (!nextCycle || nextCycle === cycle) return;
      stopAnimation();
      const index = cycle ? Math.round(rail!.scrollLeft * count / cycle) % count : 0;
      cycle = nextCycle;
      target = undefined;
      rail!.scrollLeft = cycle + cycle * index / count;
    }

    function settled() {
      if (animationFrame) return;
      target = undefined;
      const left = rail!.scrollLeft;
      if (cycle && (left < cycle - 1 || left >= 2 * cycle - 1)) {
        rail!.scrollLeft = ((left % cycle) + cycle) % cycle + cycle;
      }
    }

    function schedule() {
      clearTimeout(autoplayTimer);
      if (!inView || hovered || touching || motion.matches || document.hidden) return;
      autoplayTimer = window.setTimeout(() => {
        if (!slider!.querySelector(":focus-visible")) advance(1);
        else schedule();
      }, delay);
    }

    function advance(direction: number) {
      if (!cycle) return;
      const step = cycle / count;
      const next = (Math.round((target ?? rail!.scrollLeft) / step) + direction) * step;
      target = Math.max(0, Math.min(next, rail!.scrollWidth - rail!.clientWidth));
      if (transitionDuration > 0 && !motion.matches) {
        const start = rail!.scrollLeft;
        const end = target;
        stopAnimation();
        rail!.style.scrollSnapType = "none";
        const startedAt = performance.now();
        function animate(now: number) {
          const progress = Math.min(1, (now - startedAt) / transitionDuration);
          // Smooth acceleration and deceleration, including at the loop boundary.
          const eased = progress * progress * (3 - 2 * progress);
          rail!.scrollTo({ left: start + (end - start) * eased, behavior: "instant" });
          if (progress < 1) animationFrame = requestAnimationFrame(animate);
          else {
            stopAnimation();
            settled();
          }
        }
        animationFrame = requestAnimationFrame(animate);
      } else {
        stopAnimation();
        rail!.scrollTo({ left: target, behavior: motion.matches ? "instant" : "smooth" });
      }
      schedule();
    }

    function onScroll() {
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settled, 140);
      if (target === undefined) schedule();
    }
    function interruptAnimation() { stopAnimation(); target = undefined; schedule(); }
    function onTouchStart() { interruptAnimation(); touching = true; schedule(); }
    function onTouchEnd() { touching = false; schedule(); }
    function onPointerMove(event: PointerEvent) {
      if (!pauseOnHover || hovered || !canHover.matches || event.pointerType !== "mouse") return;
      hovered = true;
      schedule();
    }
    function onPointerLeave() { hovered = false; schedule(); }

    move.current = advance;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    }, { threshold: 0.2 });
    visibility.observe(rail);
    rail.addEventListener("scroll", onScroll, { passive: true });
    rail.addEventListener("touchstart", onTouchStart, { passive: true });
    rail.addEventListener("touchend", onTouchEnd);
    rail.addEventListener("touchcancel", onTouchEnd);
    rail.addEventListener("wheel", interruptAnimation, { passive: true });
    rail.addEventListener("pointerdown", interruptAnimation);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerleave", onPointerLeave);
    slider.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);

    return () => {
      move.current = () => {};
      clearTimeout(autoplayTimer);
      clearTimeout(settleTimer);
      stopAnimation();
      resize.disconnect();
      visibility.disconnect();
      rail.removeEventListener("scroll", onScroll);
      rail.removeEventListener("touchstart", onTouchStart);
      rail.removeEventListener("touchend", onTouchEnd);
      rail.removeEventListener("touchcancel", onTouchEnd);
      rail.removeEventListener("wheel", interruptAnimation);
      rail.removeEventListener("pointerdown", interruptAnimation);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerleave", onPointerLeave);
      slider.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, [count, delay, pauseOnHover, transitionDuration]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move.current(event.key === "ArrowRight" ? 1 : -1);
  }

  return { carousel, viewport, move, onKeyDown };
}
