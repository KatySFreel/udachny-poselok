"use client";
import { useCmsCopy } from "./cms-provider";


import styles from "./home-settlements-map.module.css";
import { HomeSettlementsMapBoard } from "./home-settlements-map-board";

export function HomeSettlementsMap() {
  const cms = useCmsCopy();

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-settlements-map-title">
      <h2 className={styles.heading} id="home-settlements-map-title">
        {cms.text("copy.home-settlements-map.1", "Все посёлки ")}<em>{cms.text("copy.home-settlements-map.2", "на одной карте")}</em>
      </h2>
      <HomeSettlementsMapBoard />
    </section>
  );
}
