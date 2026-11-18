import { settlements } from "../content/settlements";
import { CatalogCard } from "./catalog-card";
import { SettlementCard } from "./settlement-card";
import { SettlementFilterGrid } from "./settlement-filter-grid";
import styles from "./settlements.module.css";

export function HomeSettlements() {
  return (
    <section className={styles.section} aria-labelledby="home-settlements-title">
      <div className="shell">
        <div className={styles.sectionLabel}>Коттеджные посёлки</div>
        <h2 className={styles.heading} id="home-settlements-title">
          У леса, у воды или ближе к городу — <em>выберите своё место</em>
        </h2>
      </div>
      <SettlementFilterGrid
        cards={settlements.map(settlement => ({
          id: settlement.slug,
          districtId: settlement.districtId,
          content: <SettlementCard settlement={settlement} />,
        }))}
        catalogCard={
          <CatalogCard
            href="/poselki"
            label="Смотреть все посёлки"
            title="Узнайте больше о посёлках"
            imageDirectory="/images/settlements"
            pattern={{
              src: "/images/settlements/catalog-pattern.svg",
              tablet: "/images/settlements/catalog-pattern-tablet.svg",
              width: 445,
            }}
          />
        }
      />
    </section>
  );
}
