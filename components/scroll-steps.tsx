"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./home-steps.module.css";

export function ScrollSteps({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const header = document.querySelector("header.site-header");
    if (!stage || !viewport) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const routeElements = viewport.querySelectorAll<HTMLElement>("[data-route-step], [data-route-line]");
    const stepGroups = new Map<string, HTMLElement[]>();
    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        const element = target as HTMLElement;
        const step = element.dataset.routeStep;
        const items = step ? stepGroups.get(step) ?? [element] : [element];
        items.forEach((item) => { item.dataset.routeMotion = "entering"; });
      }
    }, { rootMargin: "-80px 0px -16px", threshold: 0.12 });

    for (const element of routeElements) {
      const step = element.dataset.routeStep;
      if (step) {
        const items = stepGroups.get(step) ?? [];
        items.push(element);
        stepGroups.set(step, items);
      }
      element.dataset.routeMotion = "waiting";
      if (!step || element.tagName === "LI") observer.observe(element);
    }

    function finishLine(event: AnimationEvent) {
      if (!(event.target instanceof SVGElement)) return;
      const line = event.target.closest<HTMLElement>("[data-route-line]");
      if (line) line.dataset.routeMotion = "shown";
    }

    viewport.addEventListener("animationend", finishLine);

    let frame = 0;
    let travel = 0;
    let pinTop = 0;
    let lastTime = 0;
    let position = 0;

    const syncScroll = (time: number) => {
      frame = 0;
      if (travel) {
        const progress = pinTop - stage.getBoundingClientRect().top;
        const target = Math.max(0, Math.min(travel, progress));
        const distance = target - position;
        // Ease wheel notches over time, with the same response at any refresh rate.
        const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
        const finished = Math.abs(distance) < 1;
        position = finished ? target : position + distance * (1 - Math.exp(-elapsed / 90));
        viewport.scrollLeft = position;
        if (!finished) {
          lastTime = time;
          frame = window.requestAnimationFrame(syncScroll);
          return;
        }
      }
      lastTime = 0;
    };

    const onScroll = () => {
      if (travel && !frame) frame = window.requestAnimationFrame(syncScroll);
    };

    const measure = () => {
      const height = viewport.offsetHeight;
      const availableTravel = viewport.scrollWidth - viewport.clientWidth;
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const headerClearance = Math.ceil(headerBottom) + 24;
      // Centre the diagram in the part of the viewport below the fixed header.
      pinTop = headerClearance + Math.max(0, Math.floor((window.innerHeight - headerClearance - height) / 2));
      const remaining = window.innerHeight - pinTop - height;
      travel = !reducedMotion.matches && remaining >= 0 ? availableTravel : 0;
      // Keep the last step pinned briefly before the page continues downward.
      const endPause = travel ? Math.min(120, Math.round(window.innerHeight * 0.12)) : 0;
      stage.dataset.pinned = travel ? "true" : "false";
      stage.style.setProperty("--steps-top", `${pinTop}px`);
      stage.style.setProperty("--steps-travel", `${travel + endPause}px`);
      stage.style.setProperty("--steps-clearance", travel ? `${remaining}px` : "0px");
      viewport.tabIndex = travel || !availableTravel ? -1 : 0;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (travel) {
        position = Math.max(0, Math.min(travel, pinTop - stage.getBoundingClientRect().top));
        viewport.scrollLeft = position;
      }
    };

    const resize = new ResizeObserver(measure);
    resize.observe(viewport);
    if (header) resize.observe(header);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    reducedMotion.addEventListener("change", measure);
    measure();

    return () => {
      observer.disconnect();
      viewport.removeEventListener("animationend", finishLine);
      routeElements.forEach((element) => { delete element.dataset.routeMotion; });
      resize.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <div ref={viewportRef} className={styles.viewport} role="group" aria-label="Этапы покупки и строительства" tabIndex={0}>
        <div className={styles.track}>{children}</div>
      </div>
    </div>
  );
}
