"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

export function CoverHeader({ coverId, children }: { coverId: string; children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const cover = document.getElementById(coverId);
    const header = headerRef.current;
    if (!cover || !header) return;

    const page = header.parentElement;
    const lightPanels = Array.from(document.querySelectorAll('[data-header-theme="light"]'));
    let frame: number | null = null;

    const updateTheme = () => {
      frame = null;
      page?.toggleAttribute("data-header-scrolled", window.scrollY >= 10);
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

    const closeMenuOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.contains(event.target)) {
        header.querySelector<HTMLDetailsElement>(".mobile-menu")?.removeAttribute("open");
      }
    };
    const closeMenuOnEscape = (event: globalThis.KeyboardEvent) => {
      const menu = header.querySelector<HTMLDetailsElement>(".mobile-menu[open]");
      if (event.key !== "Escape" || !menu) return;
      menu.open = false;
      menu.querySelector<HTMLElement>(":scope > summary")?.focus();
    };

    const updateHeaderOffset = () => {
      page?.style.setProperty("--site-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };
    const resize = new ResizeObserver(() => {
      updateHeaderOffset();
      scheduleUpdate();
    });
    [document.body, cover, header, ...lightPanels].forEach((element) => resize.observe(element));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    document.addEventListener("pointerdown", closeMenuOutside);
    document.addEventListener("keydown", closeMenuOnEscape);
    updateHeaderOffset();
    updateTheme();

    return () => {
      resize.disconnect();
      page?.removeAttribute("data-header-scrolled");
      page?.style.removeProperty("--site-header-height");
      window.removeEventListener("scroll", scheduleUpdate);
      document.removeEventListener("pointerdown", closeMenuOutside);
      document.removeEventListener("keydown", closeMenuOnEscape);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [coverId]);

  function closeMenuOnAnchor(event: MouseEvent<HTMLElement>) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const action = (event.target as Element).closest(".mobile-menu a[href], .mobile-menu button[command='show-modal']");
    const menu = action?.closest<HTMLDetailsElement>(".mobile-menu");
    if (menu) menu.open = false;
  }

  return (
    <header ref={headerRef} className="site-header" data-theme={isDark ? "dark" : "light"} onClick={closeMenuOnAnchor}>
      {children}
    </header>
  );
}
