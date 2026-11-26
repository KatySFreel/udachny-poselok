"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type {
  Plot,
  SettlementPageData,
  SettlementPlanData,
} from "../content/settlement-pages";
import { leadTrigger, settlementLeadForm } from "../lib/lead-attribution";
import { formatNumber } from "../lib/format-number";
import { plotStatusLabels } from "../lib/plan-contract";
import { sitePath } from "../lib/site-path";
import { PlanDrawing, plotLabel } from "./plan-drawing";
import { useMediaQuery } from "./use-media-query";
import { useOutsideDismiss } from "./use-outside-dismiss";
import { useDragPan } from "./use-drag-pan";
import panStyles from "./pan-viewport.module.css";
import styles from "./aerial-plan.module.css";

type Filters = {
  minArea: string;
  maxArea: string;
  minPrice: string;
  maxPrice: string;
  available: boolean;
  certificate: boolean;
  sold: boolean;
};
const empty: Filters = {
  minArea: "",
  maxArea: "",
  minPrice: "",
  maxPrice: "",
  available: false,
  certificate: false,
  sold: false,
};

function PlanBoard({
  plan,
  data,
}: {
  plan: SettlementPlanData;
  data: SettlementPageData;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const filterArea = useRef<HTMLDivElement>(null);
  const pan = useDragPan();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const card = useRef<HTMLElement>(null),
    [cardSize, setCardSize] = useState({ width: 429, height: 373 }),
    [scroll, setScroll] = useState({ left: 0, top: 0 });
  const positionCard = useMediaQuery("(min-width: 768px)");
  const [selected, setSelected] = useState<Plot | null>(null),
    [filtersOpen, setFiltersOpen] = useState(false),
    [filters, setFilters] = useState<Filters>(empty),
    [zoom, setZoom] = useState(1),
    [phase, setPhase] = useState("");
  const id = useId();
  useOutsideDismiss({ enabled: filtersOpen, refs: [filterArea], onDismiss: () => setFiltersOpen(false) });
  useOutsideDismiss({ enabled: !!selected, refs: [card], onDismiss: () => setSelected(null) });
  useEffect(() => {
    const element = card.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setCardSize({ width: element.offsetWidth, height: element.offsetHeight }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [selected?.id]);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setSize({ width: element.clientWidth, height: element.clientHeight }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const width =
      Math.max(size.width, (size.height * plan.width) / plan.height) * zoom,
    height = (width * plan.height) / plan.width;
  useEffect(() => {
    const element = viewport.current;
    if (element && zoom === 1)
      element.scrollLeft = Math.max(
        0,
        (element.scrollWidth - element.clientWidth) / 2,
      );
  }, [size.width, size.height, zoom]);
  const matching = new Set(
    plan.plots
      .filter((p) => {
        if (
          filters.minArea &&
          (p.area === undefined || p.area < Number(filters.minArea))
        )
          return false;
        if (
          filters.maxArea &&
          (p.area === undefined || p.area > Number(filters.maxArea))
        )
          return false;
        if (
          filters.minPrice &&
          (p.price === undefined || p.price < Number(filters.minPrice))
        )
          return false;
        if (
          filters.maxPrice &&
          (p.price === undefined || p.price > Number(filters.maxPrice))
        )
          return false;
        if (filters.available || filters.certificate || filters.sold)
          return (
            (filters.available && p.status === "available") ||
            (filters.sold && p.status === "sold") ||
            (filters.certificate &&
              (plan.filterKind === "construction"
                ? p.status === "construction"
                : p.certificateEligible && p.status === "available"))
          );
        return true;
      })
      .map((p) => p.id),
  );
  const filtered = JSON.stringify(filters) !== JSON.stringify(empty);
  const label = selected ? plotLabel(selected) : null;
  const cardStyle =
    positionCard && label
      ? {
          left: Math.max(
            16,
            Math.min(
              size.width - cardSize.width - 16,
              (label.x * width) / plan.width - scroll.left - cardSize.width / 2,
            ),
          ),
          top: Math.max(
            80,
            Math.min(
              size.height - cardSize.height - 68,
              (label.y * height) / plan.height -
                scroll.top -
                cardSize.height -
                24,
            ),
          ),
        }
      : undefined;
  function field(name: keyof Filters, value: string | boolean) {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setSelected(null);
  }
  function openRequest(reservation = false) {
    if (!reservation) {
      setSelected(null);
      setFiltersOpen(false);
      document.getElementById("settlement-visits")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
      return;
    }
    const parent = viewport.current?.closest("dialog");
    parent?.close();
    const dialog = document.getElementById(`${data.slug}-visit`);
    if (dialog instanceof HTMLDialogElement) dialog.showModal();
  }
  return (
    <div className={styles.board} onKeyDown={event => {
      if (event.key === "Escape" && (selected || filtersOpen)) {
        event.preventDefault();
        setSelected(null);
        setFiltersOpen(false);
      }
    }}>
      <div
        ref={viewport}
        className={`${styles.viewport} ${panStyles.viewport}`}
        {...pan.handlers}
        onScroll={(event) =>
          setScroll({
            left: event.currentTarget.scrollLeft,
            top: event.currentTarget.scrollTop,
          })
        }
        data-dragging={pan.dragging || undefined}
        tabIndex={0}
        role="region"
        aria-label={`Генплан ${data.name}. Перемещение перетаскиванием или клавишами со стрелками.`}
      >
        <PlanDrawing
          plan={plan}
          assets={data.assets}
          selectedId={selected?.id}
          onSelect={setSelected}
          matchingIds={matching}
          phaseId={phase}
          style={
            {
              width: width || "100%",
              height: height || "100%",
            } as CSSProperties
          }
        />
      </div>
      <div ref={filterArea} className={styles.filterArea}>
        <button
          className={styles.pill}
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={`${id}-filters`}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 4h3m4 0h7M3 10h7m4 0h3M3 16h1m4 0h9"
              fill="none"
              stroke="currentColor"
            />
            <circle cx="8" cy="4" r="2" fill="none" stroke="currentColor" />
            <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" />
            <circle cx="6" cy="16" r="2" fill="none" stroke="currentColor" />
          </svg>
          Фильтры
        </button>
        {filtersOpen && (
          <form
            className={styles.filters}
            id={`${id}-filters`}
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset>
              <legend>Площадь участка, сотки</legend>
              <div className={styles.ranges}>
                {(["minArea", "maxArea"] as const).map((name, index) => (
                  <input
                    key={name}
                    aria-label={`Площадь ${index ? "до" : "от"}`}
                    placeholder={index ? "До" : "От"}
                    type="number"
                    min="0"
                    step="0.1"
                    value={filters[name]}
                    onChange={(event) => field(name, event.target.value)}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Стоимость, ₽</legend>
              <div className={styles.ranges}>
                {(["minPrice", "maxPrice"] as const).map((name, index) => (
                  <input
                    key={name}
                    aria-label={`Стоимость ${index ? "до" : "от"}`}
                    placeholder={index ? "До" : "От"}
                    type="number"
                    min="0"
                    step="1000"
                    value={filters[name]}
                    onChange={(event) => field(name, event.target.value)}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Статусы</legend>
              {(
                [
                  ["available", "В продаже"],
                  [
                    "certificate",
                    plan.filterKind === "construction"
                      ? "С подрядным строительством"
                      : "В сумму сертификата",
                  ],
                  ["sold", "Продан"],
                ] as const
              ).map(([name, label]) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={filters[name]}
                    onChange={(event) => field(name, event.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {filtered && (
              <p className={styles.count} role="status">
                {matching.size
                  ? `Найдено участков: ${matching.size}`
                  : "По этим параметрам участков нет"}
              </p>
            )}
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setFilters(empty);
                setSelected(null);
              }}
            >
              Сбросить
            </button>
          </form>
        )}
      </div>
      <div
        className={styles.controls}
        role="group"
        aria-label="Масштаб генплана"
      >
        <button
          type="button"
          className={styles.pill}
          aria-label="Увеличить генплан"
          disabled={zoom >= 3}
          onClick={() => setZoom(Math.min(3, zoom + 0.25))}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14M12 5v14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={styles.pill}
          aria-label="Уменьшить генплан"
          disabled={zoom <= 1}
          onClick={() => setZoom(Math.max(1, zoom - 0.25))}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {plan.phases && (
        <div
          className={styles.phases}
          role="group"
          aria-label="Очереди посёлка"
        >
          {plan.phases.map((item) => (
            <button
              type="button"
              className={styles.pill}
              key={item.id}
              aria-pressed={phase === item.id}
              onClick={() => {
                setPhase(phase === item.id ? "" : item.id);
                setSelected(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {selected && (
        <article
          key={selected.id}
          ref={card}
          className={styles.card}
          style={cardStyle}
          aria-labelledby={`${id}-plot`}
          data-filters-open={filtersOpen || undefined}
          data-read-only={
            !["available", "reserved", "unknown"].includes(selected.status) ||
            undefined
          }
        >
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть участок"
            onClick={() => setSelected(null)}
          >
            <img
              src={sitePath("/icons/quiz/close.svg")}
              width={15.5}
              height={15.5}
              alt=""
            />
          </button>
          <header>
            <h3 id={`${id}-plot`}>Участок {selected.number}</h3>
            <span>
              {plan.phases?.find((p) => p.id === selected.phaseId)?.label}
            </span>
          </header>
          <dl>
            {["available", "reserved", "unknown"].includes(selected.status) && (
              <>
                <div>
                  <dt>Площадь</dt>
                  <dd>
                    {selected.area
                      ? `${selected.area.toLocaleString("ru-RU")} сот`
                      : "Уточняется"}
                  </dd>
                </div>
                <div>
                  <dt>Стоимость</dt>
                  <dd>
                    {selected.price
                      ? `${formatNumber(selected.price)} ₽`
                      : "Уточняется"}
                  </dd>
                </div>
              </>
            )}
            <div>
              <dt>Статус</dt>
              <dd>{plotStatusLabels[selected.status]}</dd>
            </div>
          </dl>
          {["available", "reserved", "unknown"].includes(selected.status) && (
            <>
              <button
                type="button"
                className={styles.request}
                {...leadTrigger(
                  settlementLeadForm("visit", data.slug, data.name).id,
                  {
                    buttonId: "plan-visit",
                    buttonLabel: "Записаться на экскурсию",
                    placement: "plan",
                    plotId: selected.id,
                    plotNumber: selected.number,
                  },
                  { deferTo: data.slug },
                )}
                onClick={() => openRequest()}
              >
                Записаться на экскурсию
              </button>
              <button
                type="button"
                className={styles.textButton}
                {...leadTrigger(
                  settlementLeadForm("visit", data.slug, data.name).id,
                  {
                    buttonId: "plan-reservation",
                    buttonLabel: "Узнать условия бронирования",
                    placement: "plan",
                    plotId: selected.id,
                    plotNumber: selected.number,
                  },
                )}
                onClick={() => openRequest(true)}
              >
                Узнать условия бронирования
              </button>
            </>
          )}
        </article>
      )}
    </div>
  );
}

export function AerialSettlementPlan({ data }: { data: SettlementPageData }) {
  const [index, setIndex] = useState(0);
  const plans = [data.plan, ...(data.additionalPlans ?? [])],
    plan = plans[index] ?? plans[0];
  return (
    <div data-reveal data-aerial-plan>
      {plans.length > 1 && (
        <div
          className={styles.planTabs}
          role="group"
          aria-label="Выбор генплана"
        >
          {plans.map((p, i) => (
            <button
              type="button"
              key={i}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {p.label ?? `Генплан ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      <PlanBoard key={index} plan={plan} data={data} />
    </div>
  );
}
