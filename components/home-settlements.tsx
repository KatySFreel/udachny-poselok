"use client";
import { useCmsCopy } from "./cms-provider";


import { CatalogCard } from "./catalog-card";
import { SettlementListing } from "./settlement-listing";
import styles from "./settlements.module.css";

export function HomeSettlements() {
  const cms = useCmsCopy();

  return (
    <section className={`${styles.section} ${styles.compactCards}`} aria-labelledby="home-settlements-title">
      <div className="shell">
        <div className={styles.sectionLabel}>{cms.text("copy.home-settlements.1", "Коттеджные посёлки")}</div>
        <h2 className={styles.heading} id="home-settlements-title">
          {cms.text("copy.home-settlements.2", "У леса, у воды или ближе к городу — ")}<em>{cms.text("copy.home-settlements.3", "выберите своё место")}</em>
        </h2>
      </div>
      <SettlementListing
        catalogCard={
          <CatalogCard
            href="/poselki"
            label={cms.text("copy.home-settlements.4", "Смотреть все посёлки")}
            title={cms.text("copy.home-settlements.5", "Узнайте больше о посёлках")}
            imageDirectory="/images/settlements"
            pattern={{
              src: cms.text("copy.home-settlements.6", "/images/settlements/catalog-pattern.svg"),
              tablet: cms.text("copy.home-settlements.7", "/images/settlements/catalog-pattern-tablet.svg"),
              width: 445,
            }}
          />
        }
      />
    </section>
  );
}
