import { sitePath } from "../lib/site-path";
import { houseProjects, readyHouses } from "../content/houses";
import { ActionLink } from "./action";
import { CatalogCard } from "./catalog-card";
import { HouseCard } from "./house-card";
import { HouseFilter } from "./house-filter";
import styles from "./home-houses.module.css";
import shared from "./settlements.module.css";

export function HomeHouses() {
  return (
    <section className={`shell ${shared.section} ${styles.section}`} aria-labelledby="home-houses-title">
      <div className={shared.sectionLabel}>Строительство домов</div>
      <HouseFilter
        projects={(
          <ul className={styles.grid}>
            {houseProjects.map(house => <li key={house.slug}><HouseCard house={house} /></li>)}
            <li className={styles.catalogSlot}>
              <CatalogCard
                href={sitePath("/doma")}
                label="Смотреть все проекты домов"
                title="Посмотреть все проекты домов"
                imageDirectory="/images/houses"
                pattern={{
                  src: "/images/houses/pattern.svg",
                  tablet: "/images/houses/pattern-tablet.svg",
                  desktop: "/images/houses/pattern-desktop.svg",
                  width: 608,
                }}
                className={styles.catalog}
                patternClassName={styles.pattern}
              />
            </li>
          </ul>
        )}
        ready={(
          <>
            <ul className={`${styles.grid} ${styles.readyGrid}`}>
              {readyHouses.map(house => <li key={house.slug}><HouseCard house={house} ready /></li>)}
            </ul>
            <div className={styles.readyAction}>
              <ActionLink href={sitePath("/doma/gotovye")} aria-label="Смотреть все готовые дома">Смотреть все</ActionLink>
            </div>
          </>
        )}
      />
    </section>
  );
}
