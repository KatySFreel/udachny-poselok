"use client";

import { useState, type ReactNode } from "react";
import styles from "./home-houses.module.css";
import shared from "./settlements.module.css";

const filters = [
  { id: "projects", label: "Проекты домов" },
  { id: "ready", label: "Готовые дома" },
] as const;

export function HouseFilter({ projects, ready }: { projects: ReactNode; ready: ReactNode }) {
  const [selected, setSelected] = useState<"projects" | "ready">("projects");
  const isProjects = selected === "projects";

  return (
    <>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-houses-title">
        {isProjects && <span className={styles.wideTitle}>От первой дачи <em>до семейного дома</em></span>}
        <span className={isProjects ? styles.standardTitle : undefined}>Дом, который начинается <em>с вашей идеи</em></span>
      </h2>
      <div className={`${shared.filters} ${styles.filters}`} role="group" aria-label="Тип дома">
        {filters.map(({ id, label }) => (
          <button key={id} className={shared.chip} type="button" aria-pressed={selected === id} aria-controls="home-house-results" onClick={() => setSelected(id)}>
            {label}
          </button>
        ))}
      </div>
      <div id="home-house-results">
        <div hidden={!isProjects}>{projects}</div>
        <div hidden={isProjects}>{ready}</div>
      </div>
    </>
  );
}
