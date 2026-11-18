"use client";

import { useEffect } from "react";

export function HomeMotion() {
  useEffect(() => {
    const main = document.getElementById("home-main");
    if (!main) return;

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
      observer.disconnect();
      elements.forEach((element) => element.removeAttribute("data-motion"));
    };
  }, []);

  return null;
}
