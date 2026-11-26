"use client";

import { useEffect } from "react";

function alignInitialFragment(main: HTMLElement) {
  const initialHash = location.hash;
  if (!initialHash) return;
  let id: string;
  try { id = decodeURIComponent(initialHash.slice(1)); }
  catch { return; }
  const target = document.getElementById(id);
  if (!target || !main.parentElement?.contains(target)) return;

  let cancelled = false;
  let frame = 0;
  const cancel = () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
  // Never pull the visitor back after they have started navigating manually.
  const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  events.forEach((name) => window.addEventListener(name, cancel, { passive: true, once: true }));

  // Scroll-driven sections add their travel after hydration. Wait for effects
  // and font metrics before resolving the initial fragment's final position.
  void document.fonts.ready.then(() => {
    if (cancelled) return;
    frame = requestAnimationFrame(() => {
      if (!cancelled && location.hash === initialHash) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
  });

  return () => {
    cancel();
    events.forEach((name) => window.removeEventListener(name, cancel));
  };
}

function prepareHero(main: HTMLElement) {
  const hero = main.querySelector<HTMLElement>(".hero, [data-cover-motion]");
  const image = hero?.querySelector<HTMLImageElement>(".hero__background img, :scope > picture img, [data-cover-image] img");
  const title = hero?.querySelector<HTMLElement>("h1");
  const emphasis = title?.querySelector("em");
  if (!hero || !title || !emphasis) return;

  let active = true;
  const reveal = () => {
    if (!active || hero.dataset.heroReady) return;
    hero.dataset.heroReady = getComputedStyle(title).opacity === "1" || window.scrollY > 32 ? "skip" : "true";
    window.clearTimeout(timeout);
  };

  const timeout = window.setTimeout(reveal, 3500);
  void Promise.allSettled([
    image?.decode() ?? Promise.resolve(),
    document.fonts.load('500 1em "Manrope Variable"', title.textContent ?? ""),
    document.fonts.load('italic 400 1em "Playfair Display"', emphasis.textContent ?? ""),
    document.fonts.load('400 1em Evolventa', hero.textContent ?? ""),
  ]).then(reveal);

  return () => {
    active = false;
    window.clearTimeout(timeout);
  };
}

function prepareCoverParallax(main: HTMLElement) {
  const layer = main.querySelector<HTMLElement>("[data-cover-parallax]");
  const image = layer?.querySelector("img");
  const cover = layer?.closest<HTMLElement>("[data-cover-motion], .hero__screen");
  if (!layer || !image || !cover) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let visible = false;

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    image.style.removeProperty("--cover-parallax-y");
    image.style.removeProperty("--cover-parallax-scale");
  };
  const draw = () => {
    frame = 0;
    if (!visible || reduced.matches || document.hidden) return;
    const bounds = cover.getBoundingClientRect();
    const cap = Math.min(window.innerWidth < 768 ? 10 : 24, image.clientHeight * 0.035);
    const offset = Math.max(-cap, Math.min(cap, -bounds.top * 0.08));
    // Reserve enough image beyond both edges even for short catalog banners.
    const scale = 1 + (2 * (cap + 1)) / Math.max(image.clientHeight, 1);
    image.style.setProperty("--cover-parallax-y", `${offset.toFixed(2)}px`);
    image.style.setProperty("--cover-parallax-scale", String(scale));
  };
  const update = () => {
    if (!frame && visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const motionChanged = () => { reset(); update(); };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) update();
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  observer.observe(cover);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  document.addEventListener("visibilitychange", motionChanged);
  reduced.addEventListener("change", motionChanged);
  return () => {
    reset();
    observer.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    document.removeEventListener("visibilitychange", motionChanged);
    reduced.removeEventListener("change", motionChanged);
  };
}

export function PageMotion({ mainId }: { mainId: string }) {
  useEffect(() => {
    const main = document.getElementById(mainId);
    if (!main) return;
    const stopHero = prepareHero(main);
    const stopParallax = prepareCoverParallax(main);
    const stopFragment = alignInitialFragment(main);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.setAttribute("data-motion", "entering");
      }
    }, { rootMargin: "0px 0px -72px" });

    const elements = new Set<Element>(main.querySelectorAll("[data-reveal]"));
    for (const section of main.querySelectorAll(":scope > section:not(.hero, [data-cover-motion])")) {
      const headingId = section.getAttribute("aria-labelledby");
      const heading = headingId && document.getElementById(headingId);
      if (heading) elements.add(heading.closest("[data-reveal]") ?? heading);
    }

    // Arm only content below the viewport so a restored page never flashes blank.
    elements.forEach((element) => {
      // A composed card/panel enters once; don't animate its heading a second time.
      const parentReveal = element.parentElement?.closest("[data-reveal]");
      if (parentReveal && main.contains(parentReveal)) return;
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.setAttribute("data-motion", "waiting");
      observer.observe(element);
    });

    return () => {
      stopHero?.();
      stopParallax?.();
      stopFragment?.();
      observer.disconnect();
      elements.forEach((element) => element.removeAttribute("data-motion"));
    };
  }, [mainId]);

  return null;
}
