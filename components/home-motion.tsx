"use client";

import { useEffect } from "react";

function prepareHero(main: HTMLElement) {
  const hero = main.querySelector<HTMLElement>(".hero");
  const image = hero?.querySelector<HTMLImageElement>(".hero__background img");
  const title = hero?.querySelector<HTMLElement>("h1");
  const emphasis = title?.querySelector("em");
  if (!hero || !image || !title || !emphasis) return;

  let active = true;
  const reveal = () => {
    if (!active || hero.dataset.heroReady) return;
    hero.dataset.heroReady = getComputedStyle(title).opacity === "1" || window.scrollY > 32 ? "skip" : "true";
    window.clearTimeout(timeout);
  };

  const timeout = window.setTimeout(reveal, 3500);
  void Promise.allSettled([
    image.decode(),
    document.fonts.load('500 1em "Manrope Variable"', title.textContent ?? ""),
    document.fonts.load('italic 400 1em "Playfair Display"', emphasis.textContent ?? ""),
    document.fonts.load('400 1em Evolventa', hero.textContent ?? ""),
  ]).then(reveal);

  return () => {
    active = false;
    window.clearTimeout(timeout);
  };
}

export function HomeMotion() {
  useEffect(() => {
    const main = document.getElementById("home-main");
    if (!main) return;
    const stopHero = prepareHero(main);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.setAttribute("data-motion", "entering");
      }
    }, { rootMargin: "0px 0px -72px" });

    const elements = new Set<Element>(main.querySelectorAll("[data-reveal]"));
    for (const section of main.querySelectorAll(":scope > section:not(.hero)")) {
      const headingId = section.getAttribute("aria-labelledby");
      const heading = headingId && document.getElementById(headingId);
      if (heading) elements.add(heading);
    }

    // Arm only content below the viewport so a restored page never flashes blank.
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.setAttribute("data-motion", "waiting");
      observer.observe(element);
    });

    return () => {
      stopHero?.();
      observer.disconnect();
      elements.forEach((element) => element.removeAttribute("data-motion"));
    };
  }, []);

  return null;
}
