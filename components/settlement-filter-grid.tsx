"use client";

import { useState, type ReactNode } from "react";
import { settlementDistricts } from "../content/settlements";
import styles from "./settlements.module.css";

const filters = [{ id: "all", label: "Все" }, ...settlementDistricts] as const;
type FilterId = (typeof filters)[number]["id"];

export function SettlementFilterGrid({
  cards,
  catalogCard,
  wrapOnTablet = false,
  resultsId = "home-settlement-results",
}: {
  cards: readonly { id: string; districtId: string; content: ReactNode }[];
  catalogCard?: ReactNode;
  wrapOnTablet?: boolean;
  resultsId?: string;
}) {
  const [selected, setSelected] = useState<FilterId>("all");
  const visibleCards = selected === "all"
    ? cards
    : cards.filter(({ districtId }) => districtId === selected);

  return (
    <>
      <div className={`${styles.filters} ${styles.scrollFilters}`} data-wrap-on-tablet={wrapOnTablet || undefined} role="group" aria-label="Фильтр посёлков по району">
        {filters.map(({ id, label }) => (
          <button
            className={styles.chip}
            key={id}
            type="button"
            aria-pressed={selected === id}
            aria-controls={resultsId}
            disabled={id !== "all" && !cards.some(({ districtId }) => districtId === id)}
            onClick={() => setSelected(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className={styles.resultStatus} aria-live="polite">Найдено посёлков: {visibleCards.length}</p>
      <ul className={`shell ${styles.grid}`} id={resultsId}>
        {visibleCards.map(({ id, content }) => <li key={id}>{content}</li>)}
        {catalogCard && <li className={styles.catalog}>{catalogCard}</li>}
      </ul>
    </>
  );
}
