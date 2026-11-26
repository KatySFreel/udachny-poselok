"use client";
import { useCmsCopy } from "./cms-provider";


import { useState, type ReactNode } from "react";
import { FilterChips } from "./filter-chips";
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
  const cms = useCmsCopy();
  const filters = cms.data("local.settlement-filter-grid.filters", _cmsSource_filters);

  const [selected, setSelected] = useState<FilterId>("all");
  const visibleCards = selected === "all"
    ? cards
    : cards.filter(({ districtId }) => districtId === selected);

  return (
    <>
      <FilterChips items={filters.map(item => ({...item,disabled:item.id !== 'all' && !cards.some(card => card.districtId === item.id)}))} value={selected} onChange={setSelected} label={cms.text("copy.settlement-filter-grid.1", "Фильтр посёлков по району")} controls={resultsId} className={styles.scrollFilters} wrapOnTablet={wrapOnTablet} />
      <p className={styles.resultStatus} aria-live="polite">{cms.text("copy.settlement-filter-grid.2", "Найдено посёлков: ")}{visibleCards.length}</p>
      <ul className={`shell ${styles.grid}`} id={resultsId}>
        {visibleCards.map(({ id, content }) => <li key={id}>{content}</li>)}
        {catalogCard && <li className={styles.catalog}>{catalogCard}</li>}
      </ul>
    </>
  );
}

const _cmsSource_filters = filters;
