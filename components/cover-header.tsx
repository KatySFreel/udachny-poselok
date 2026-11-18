"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

export function CoverHeader({ coverId, children }: { coverId: string; children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const cover = document.getElementById(coverId);
    const header = headerRef.current;
    if (!cover || !header) return;

    const lightPanels = Array.from(document.querySelectorAll('[data-header-theme="light"]'));
    let frame: number | null = null;

    const updateTheme = () => {
      frame = null;
      const headerBounds = header.getBoundingClientRect();
      const headerCenter = headerBounds.top + headerBounds.height / 2;
      const isOverLightHeaderPanel = lightPanels.some((panel) => {
        const { top, bottom } = panel.getBoundingClientRect();
        return top <= headerCenter && headerCenter < bottom;
      });
      setIsDark(cover.getBoundingClientRect().bottom <= headerBounds.top && !isOverLightHeaderPanel);
    };

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateTheme);
    };

    const home = header.closest<HTMLElement>(".home");
    const updateHeaderOffset = () => {
      home?.style.setProperty("--site-header-bottom", `${Math.ceil(header.getBoundingClientRect().bottom)}px`);
    };
    const resize = new ResizeObserver(() => {
      updateHeaderOffset();
      scheduleUpdate();
    });
    [document.body, cover, header, ...lightPanels].forEach((element) => resize.observe(element));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    updateHeaderOffset();
    updateTheme();

    return () => {
      resize.disconnect();
      home?.style.removeProperty("--site-header-bottom");
      window.removeEventListener("scroll", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [coverId]);

  function closeMenuOnAnchor(event: MouseEvent<HTMLElement>) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>(".mobile-menu a[href]");
    if (!link?.hash || link.origin !== location.origin || link.pathname !== location.pathname || link.search !== location.search) return;
    const menu = link.closest<HTMLDetailsElement>(".mobile-menu");
    if (menu) menu.open = false;
  }

  return (
    <header ref={headerRef} className="site-header" data-theme={isDark ? "dark" : "light"} onClick={closeMenuOnAnchor}>
      {children}
    </header>
  );
}
