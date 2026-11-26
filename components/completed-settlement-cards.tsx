"use client";
import { useCmsCopy } from "./cms-provider";


import { useEffect, useLayoutEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { completedSettlements, type CompletedSettlement } from "../content/settlements";
import { sitePath } from "../lib/site-path";
import { AnimatedDialog } from "./animated-dialog";
import { DialogCloseButton } from "./contact-dialog";
import { CarouselButtons } from "./carousel-controls";
import { SettlementCard } from "./settlement-card";
import styles from "./completed-settlement-cards.module.css";
import cardStyles from "./settlements.module.css";

const iconDirectory = "/icons/settlement-gallery";
const photoDirectory = "/images/settlements/completed/gallery";
const photos = [1, 2, 3] as const;

function SettlementGallery({ settlement }: { settlement: CompletedSettlement }) {
  const cms = useCmsCopy();

  const viewportId = useId();
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const target = useRef<number | null>(null);
  const mouseStart = useRef<{ x: number; y: number } | null>(null);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (interacting) return;
    const timer = window.setInterval(() => {
      const viewport = rail.current;
      if (!viewport || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const index = (active + 1) % photos.length;
      target.current = index;
      viewport.scrollTo({ left: viewport.clientWidth * index, behavior: "smooth" });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, interacting]);

  function advance(direction: number) {
    const viewport = rail.current;
    const index = (target.current ?? active) + direction;
    if (!viewport || index < 0 || index >= photos.length) return;
    target.current = index;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ left: viewport.clientWidth * index, behavior: reducedMotion ? "instant" : "smooth" });
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    advance(event.key === "ArrowLeft" ? -1 : 1);
  }

  function startMouseSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    mouseStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finishMouseSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = mouseStart.current;
    mouseStart.current = null;
    if (!start || event.pointerType !== "mouse") return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) >= 40 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
      advance(distance < 0 ? 1 : -1);
    }
  }

  return (
    <div className={styles.gallery} onKeyDown={handleKeys}>
      <div className={styles.media}>
        <div
          id={viewportId}
          className={`carousel-viewport ${styles.rail}`}
          ref={rail}
          role="group"
          aria-label={cms.text("copy.completed-settlement-cards.1", "Фотографии посёлка")}
          tabIndex={0}
          onPointerDown={startMouseSwipe}
          onPointerDownCapture={() => setInteracting(true)}
          onPointerUpCapture={() => setInteracting(false)}
          onPointerCancel={() => setInteracting(false)}
          onPointerUp={finishMouseSwipe}
          onLostPointerCapture={() => { mouseStart.current = null; setInteracting(false); }}
          onScroll={(event) => {
            const { scrollLeft, clientWidth } = event.currentTarget;
            if (!clientWidth) return;
            if (target.current !== null && Math.abs(scrollLeft - clientWidth * target.current) < 1) {
              target.current = null;
            }
            setActive(Math.max(0, Math.min(photos.length - 1, Math.round(scrollLeft / clientWidth))));
          }}
          onScrollEnd={() => { target.current = null; }}
        >
          {photos.map((number, index) => (
            <picture key={number} data-settlement={settlement.slug}>
              <source media="(max-width: 767px)" srcSet={sitePath(`${photoDirectory}/${settlement.slug}-${number}-768.webp`)} />
              <img
                src={sitePath(`${photoDirectory}/${settlement.slug}-${number}.webp`)}
                alt={`Посёлок ${settlement.name}, фото ${number}`}
                aria-hidden={index !== active || undefined}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                draggable={false}
              />
            </picture>
          ))}
        </div>
        <p className={styles.sold}>{cms.text("copy.completed-settlement-cards.2", "Все участки проданы")}</p>
      </div>
      <div className={styles.controls} role="group" aria-label={cms.text("copy.completed-settlement-cards.3", "Управление галереей")}>
        <CarouselButtons viewportId={viewportId} previousLabel="Предыдущее фото" nextLabel="Следующее фото" previousDisabled={active===0} nextDisabled={active===photos.length-1} onPrevious={()=>advance(-1)} onNext={()=>advance(1)} />
      </div>
      <p className={cardStyles.resultStatus} aria-live="polite">{cms.text("copy.completed-settlement-cards.4", "Фото ")}{active + 1} {cms.text("copy.completed-settlement-cards.5", " из ")}{photos.length}</p>
    </div>
  );
}

export function CompletedSettlementCards() {
  const cms = useCmsCopy();
  const completedSettlements = cms.data("data.completedSettlements", _cmsSource_completedSettlements);

  const [selected, setSelected] = useState<CompletedSettlement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);

  return (
    <>
      <ul className={`shell ${cardStyles.grid}`}>
        {completedSettlements.map((settlement) => (
          <li key={settlement.slug}>
            <SettlementCard settlement={settlement} onOpen={() => setSelected(settlement)} />
          </li>
        ))}
      </ul>
      <AnimatedDialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="completed-settlement-title"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DialogCloseButton />
            <div className={styles.header}>
              <p className={styles.label}>{cms.text("copy.completed-settlement-cards.6", "Посёлок")}</p>
              <h2 className={styles.title} id="completed-settlement-title">{selected.name}</h2>
              <ul className={styles.details}>
                <li>
                  <img src={sitePath(`${iconDirectory}/location.svg`)} alt="" width={24} height={24} />
                  <span>{selected.location}, {selected.year} {cms.text("copy.completed-settlement-cards.7", " год")}</span>
                </li>
                <li>
                  <img src={sitePath(`${iconDirectory}/map.svg`)} alt="" width={24} height={24} />
                  <span>{selected.route}</span>
                </li>
                {selected.direction && (
                  <li>
                    <img src={sitePath(`${iconDirectory}/website.svg`)} alt="" width={24} height={24} />
                    <span>{cms.text("copy.completed-settlement-cards.8", "Направление: ")}{selected.direction}</span>
                  </li>
                )}
              </ul>
            </div>
            <SettlementGallery key={selected.slug} settlement={selected} />
          </>
        )}
      </AnimatedDialog>
    </>
  );
}

const _cmsSource_completedSettlements = completedSettlements;
