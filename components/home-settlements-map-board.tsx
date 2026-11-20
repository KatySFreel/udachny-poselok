"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { settlements } from "../content/settlements";
import { sitePath } from "../lib/site-path";
import shared from "./settlements.module.css";
import styles from "./home-settlements-map.module.css";

// Positions belong to the illustration in Figma, not to a geographic projection.
const locations = [
  { slug: "troitskaya-sloboda", x: 31.4, y: 53.2 },
  { slug: "istorii-severa", x: 19.8, y: 80.5 },
  { slug: "bereg-tigody", x: 47.6, y: 72.3 },
  { slug: "divnyy", x: 71.9, y: 59.5 },
].map(point => ({ ...point, settlement: settlements.find(item => item.slug === point.slug)! }));

const money = new Intl.NumberFormat("ru-RU");

export function HomeSettlementsMapBoard() {
  const [selected, setSelected] = useState<string | null>("divnyy");
  const [revealedMarkers, setRevealedMarkers] = useState<Set<string>>(() => new Set());
  const viewport = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const active = locations.find(point => point.slug === selected);

  useEffect(() => {
    const markers = plane.current?.querySelectorAll<HTMLButtonElement>("[data-marker]");
    if (!markers) return;

    // Observe each marker, including clipping by the horizontally scrolling map.
    // Entering the top of the map must not reveal points still below the screen.
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= .3)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      if (!visible.length) return;
      visible.forEach((entry, index) => {
        const marker = entry.target as HTMLButtonElement;
        marker.style.setProperty("--marker-delay", `${index * 140}ms`);
        marker.dataset.markerMotion = "entering";
        observer.unobserve(marker);
      });
      setRevealedMarkers(current => new Set([...current, ...visible.map(entry => (entry.target as HTMLButtonElement).dataset.marker!)]));
    }, { rootMargin: "0px 0px -96px", threshold: .3 });

    markers.forEach(marker => {
      marker.dataset.markerMotion = "waiting";
      observer.observe(marker);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element || !selected) return;
    const center = () => {
      const position = locations.find(point => point.slug === selected)!;
      element.scrollLeft = (plane.current?.clientWidth ?? 0) * position.x / 100 - element.clientWidth / 2;
    };
    const observer = new ResizeObserver(center);
    observer.observe(element);
    center();
    return () => observer.disconnect();
  }, [selected]);

  const query = active ? encodeURIComponent(`КП ${active.settlement.name.replace(/[«»]/g, "")} Ленинградская область`) : "";
  const routes = [
    { label: "Яндекс", icon: "yandex", href: `https://yandex.ru/maps/?rtext=~${query}&rtt=auto` },
    { label: "Google", icon: "google", href: `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving` },
    { label: "2ГИС", icon: "2gis", href: `https://2gis.ru/spb/search/${query}` },
  ];

  return (
    <div
      className={styles.board}
      data-settlements-map
      data-reveal
      onKeyDown={event => {
        if (event.key === "Escape" && selected) {
          viewport.current?.querySelector<HTMLButtonElement>(`[data-marker="${selected}"]`)?.focus({ preventScroll: true });
          setSelected(null);
        }
      }}
      onClick={event => {
        if (!(event.target as HTMLElement).closest("button, article")) setSelected(null);
      }}
      style={active ? { "--pin-x": active.x / 100, "--pin-y": active.y / 100 } as CSSProperties : undefined}
    >
      <div className={styles.viewport} ref={viewport} role="region" aria-label="Карта посёлков. На узком экране карту можно прокручивать по горизонтали" tabIndex={0}>
        <div className={styles.stage}>
          <div className={styles.plane} ref={plane}>
            <img className={styles.background} src={sitePath("/images/settlements-map-background.webp")} alt="Карта Ленинградской области: Санкт-Петербург, Финский залив, Гатчина, Тосно и Луга" width={1672} height={941} loading="lazy" decoding="async" draggable={false} />
            {locations.map(({ slug, settlement, x, y }) => (
              <button
                key={slug}
                type="button"
                className={styles.marker}
                style={{ left: `${x}%`, top: `${y}%` }}
                data-marker={slug}
                aria-label={`Показать посёлок ${settlement.name}`}
                aria-expanded={selected === slug && revealedMarkers.has(slug)}
                aria-controls={selected === slug && revealedMarkers.has(slug) ? "home-map-details" : undefined}
                onFocus={() => setRevealedMarkers(current => current.has(slug) ? current : new Set([...current, slug]))}
                onClick={() => setSelected(current => current === slug && revealedMarkers.has(slug) ? null : slug)}
              >
                <span className={styles.pin}><img src={sitePath("/icons/settlements-map/home.svg")} width={32} height={32} alt="" draggable={false} /></span>
                <span className={styles.markerLabel}>{settlement.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {active && revealedMarkers.has(active.slug) && (
        <article key={active.slug} className={styles.details} id="home-map-details" aria-labelledby="home-map-selected-title">
          <a className={styles.cardPhoto} href={sitePath(`/poselki/${active.slug}`)} tabIndex={-1} aria-hidden="true">
            <img src={sitePath(`/images/settlements/${active.slug}.webp`)} alt="" width={880} height={1200} loading="lazy" decoding="async" />
          </a>
          <a className={styles.summary} href={sitePath(`/poselki/${active.slug}`)}>
            <p className={`${shared.location} ${styles.location}`}><img src={sitePath("/icons/settlement-location.svg")} width={13.125} height={16.8791} alt="" />{active.settlement.location}</p>
            <h3 className={`${shared.cardTitle} ${styles.title}`} id="home-map-selected-title">{active.settlement.name}</h3>
            <div className={`${shared.priceRow} ${styles.priceRow}`}><p>От {money.format(active.settlement.price)} ₽</p><span className={shared.arrow} aria-hidden="true" /></div>
          </a>
          <div className={styles.routes}>
            <p>Проложить маршрут в приложении:</p>
            <div className={styles.routeLinks}>
              {routes.map(route => <a key={route.icon} href={route.href} target="_blank" rel="noopener noreferrer" aria-label={`Открыть ${active.settlement.name} — ${route.label}`}><img src={sitePath(`/icons/settlements-map/${route.icon}.${route.icon === "google" ? "webp" : "svg"}`)} width={24} height={24} alt="" />{route.label}</a>)}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
