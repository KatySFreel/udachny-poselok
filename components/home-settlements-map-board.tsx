"use client";
import { useOutsideDismiss } from "./use-outside-dismiss";
import { useCmsCopy } from "./cms-provider";


import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { settlements } from "../content/settlements";
import { mapRoutes } from "../lib/map-routes";
import { sitePath } from "../lib/site-path";
import { MapMarker } from "./map-marker";
import { MapSettlementCard } from "./map-settlement-card";
import styles from "./home-settlements-map.module.css";

// Positions belong to the illustration in Figma, not to a geographic projection.
const locations = [
  { id: "troitskaya-sloboda", slug: "troitskaya-sloboda", x: 7.962, y: 9.889 },
  { id: "istorii-severa", slug: "istorii-severa", x: 16.794, y: 3.556 },
  // The southern point repeats this name in Figma; keep its identity separate until clarified.
  { id: "istorii-severa-south", slug: "istorii-severa", x: 23.560, y: 68.778 },
  { id: "zelenyy-les", slug: "zelenyy-les", x: 63.043, y: 46.333 },
  { id: "bereg-tigody", slug: "bereg-tigody", x: 57.364, y: 88.222 },
  { id: "divnyy", slug: "divnyy", x: 35.625, y: 90.222 },
].map(point => ({ ...point, settlement: settlements.find(item => item.slug === point.slug)! }));


// Official company map: https://udachniyposelok.ru/ (checked 2026-11-22).
// x/y are an approximate placement on the illustration; routes use exact coordinates.
const focusedLocations: Record<string, { x: number; y: number; latitude: number; longitude: number }> = {
  "troitskaya-sloboda": { x: 23.56, y: 65.5, latitude: 59.687813286417885, longitude: 29.406918545286945 },
};

export function HomeSettlementsMapBoard({ settlementSlug }: { settlementSlug?: string }) {
  const cms = useCmsCopy();

  const editedSettlements = cms.data("data.settlements", settlements);
  const points = useMemo(() => {
    const resolvedLocations = locations.map(point => ({ ...point, settlement: editedSettlements.find(item => item.slug === point.slug)! }));
    return settlementSlug
      ? resolvedLocations.filter(point => point.slug === settlementSlug).map(point => ({ ...point, ...focusedLocations[point.slug] }))
      : resolvedLocations;
  }, [settlementSlug, editedSettlements]);
  const [selected, setSelected] = useState<string | null>(settlementSlug ?? "divnyy");
  const [revealedMarkers, setRevealedMarkers] = useState<Set<string>>(() => new Set());
  const viewport = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLElement>(null);
  const active = points.find(point => point.id === selected);
  const showDetails = !!active && revealedMarkers.has(active.id);

  useEffect(() => {
    const element = details.current;
    if (!element) return;
    const measure = () => board.current?.style.setProperty("--details-height", `${element.offsetHeight}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [active?.id, showDetails]);

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
      const position = points.find(point => point.id === selected);
      if (!position) return;
      element.scrollLeft = (plane.current?.clientWidth ?? 0) * position.x / 100 - element.clientWidth / 2;
    };
    const observer = new ResizeObserver(center);
    observer.observe(element);
    center();
    return () => observer.disconnect();
  }, [selected, points]);

  useOutsideDismiss({
    enabled: showDetails,
    refs: [details],
    onDismiss: () => setSelected(null),
    ignore: target => !!board.current?.contains(target) && !!target.closest("[data-marker]"),
  });

  const query = active ? `КП ${active.settlement.name.replace(/[«»]/g, "")} Ленинградская область` : "";
  const routes = mapRoutes(query,active ? focusedLocations[active.slug] : undefined);

  return (
    <div
      className={styles.board}
      ref={board}
      data-settlements-map
      data-reveal
      onKeyDown={event => {
        if (event.key === "Escape" && selected) {
          viewport.current?.querySelector<HTMLButtonElement>(`[data-marker="${selected}"]`)?.focus({ preventScroll: true });
          setSelected(null);
        }
      }}
      style={active ? { "--pin-x": active.x / 100, "--pin-y": active.y / 100 } as CSSProperties : undefined}
    >
      <div className={styles.viewport} ref={viewport} role="region" aria-label={`${settlementSlug ? `Карта расположения посёлка ${points[0]?.settlement.name ?? ''}` : cms.text("copy.home-settlements-map-board.1", 'Карта посёлков')}. На узком экране карту можно прокручивать по горизонтали`} tabIndex={0}>
        <div className={styles.stage}>
          <div className={styles.plane} ref={plane}>
            <img className={styles.background} src={sitePath(cms.text("copy.home-settlements-map-board.2", "/images/settlements-map-background.webp"))} alt={cms.text("copy.home-settlements-map-board.3", "Карта Ленинградской области: Санкт-Петербург, Финский залив, Гатчина, Тосно и Луга")} width={1672} height={941} loading="lazy" decoding="async" draggable={false} />
            {points.map(({ id, settlement, x, y }) => (
              <MapMarker
                key={id}
                type="button"
                label={settlement.name}
                style={{ left: `${x}%`, top: `${y}%` }}
                data-marker={id}
                aria-label={`Показать посёлок ${settlement.name}`}
                aria-expanded={selected === id && revealedMarkers.has(id)}
                aria-controls={selected === id && revealedMarkers.has(id) ? "home-map-details" : undefined}
                onFocus={() => setRevealedMarkers(current => current.has(id) ? current : new Set([...current, id]))}
                onClick={() => setSelected(current => current === id && revealedMarkers.has(id) ? null : id)}
              />
            ))}
          </div>
        </div>
      </div>
      {active && showDetails && (
        <MapSettlementCard key={active.id} ref={details} settlement={active.settlement} routes={routes} id="home-map-details" titleId="home-map-selected-title" position={active.y < 50 ? "below" : "above"} onClose={() => {
          viewport.current?.querySelector<HTMLButtonElement>(`[data-marker="${selected}"]`)?.focus({ preventScroll: true });
          setSelected(null);
        }} />
      )}
    </div>
  );
}
