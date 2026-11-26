"use client";
import { useCmsCopy } from "./cms-provider";


import { FilterChips } from "./filter-chips";
import { useState, type ReactNode } from "react";
import styles from "./home-houses.module.css";
import shared from "./settlements.module.css";

const filters = [
  { id: "projects", label: "Проекты домов" },
  { id: "ready", label: "Готовые дома" },
] as const;

export function HouseFilter({ projects, ready }: { projects: ReactNode; ready: ReactNode }) {
  const cms = useCmsCopy();
  const filters = cms.data("local.house-filter.filters", _cmsSource_filters);

  const [selected, setSelected] = useState<"projects" | "ready">("projects");
  const isProjects = selected === "projects";

  return (
    <>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-houses-title">
        {isProjects && <span className={styles.wideTitle}>{cms.text("copy.house-filter.1", "От первой дачи ")}<em>{cms.text("copy.house-filter.2", "до семейного дома")}</em></span>}
        <span className={isProjects ? styles.standardTitle : undefined}>{cms.text("copy.house-filter.3", "Дом, который начинается ")}<em>{cms.text("copy.house-filter.4", "с вашей идеи")}</em></span>
      </h2>
      <FilterChips items={filters} value={selected} onChange={setSelected} label={cms.text("copy.house-filter.5", "Тип дома")} controls="home-house-results" className={styles.filters} />
      <div id="home-house-results">
        <div hidden={!isProjects}>{projects}</div>
        <div hidden={isProjects}>{ready}</div>
      </div>
    </>
  );
}

const _cmsSource_filters = filters;
