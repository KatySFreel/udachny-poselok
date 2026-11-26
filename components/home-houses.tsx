"use client";
import { useCmsCopy } from "./cms-provider";


import { sitePath } from "../lib/site-path";
import { houseProjects, readyHouses } from "../content/houses";
import { ActionLink } from "./action";
import { CatalogCard } from "./catalog-card";
import { HouseCard } from "./house-card";
import { HouseFilter } from "./house-filter";
import styles from "./home-houses.module.css";
import shared from "./settlements.module.css";

export function HomeHouses() {
  const cms = useCmsCopy();
  const houseProjects = cms.data("data.houseProjects", _cmsSource_houseProjects);
  const readyHouses = cms.data("data.readyHouses", _cmsSource_readyHouses);

  return (
    <section className={`shell ${shared.section} ${styles.section}`} aria-labelledby="home-houses-title">
      <div className={shared.sectionLabel}>{cms.text("copy.home-houses.1", "Строительство домов")}</div>
      <HouseFilter
        projects={(
          <ul className={styles.grid}>
            {houseProjects.map(house => <li key={house.slug}><HouseCard house={house} /></li>)}
            <li className={styles.catalogSlot}>
              <CatalogCard
                href="/doma"
                label={cms.text("copy.home-houses.2", "Смотреть все проекты домов")}
                title={cms.text("copy.home-houses.3", "Посмотреть все проекты домов")}
                imageDirectory="/images/houses"
                pattern={{
                  src: cms.text("copy.home-houses.4", "/images/houses/pattern.svg"),
                  tablet: cms.text("copy.home-houses.5", "/images/houses/pattern-tablet.svg"),
                  desktop: cms.text("copy.home-houses.6", "/images/houses/pattern-desktop.svg"),
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
              <ActionLink href={sitePath("/doma#gotovye-doma")} aria-label={cms.text("copy.home-houses.7", "Смотреть все готовые дома")}>{cms.text("copy.home-houses.8", "Смотреть все")}</ActionLink>
            </div>
          </>
        )}
      />
    </section>
  );
}

const _cmsSource_houseProjects = houseProjects;
const _cmsSource_readyHouses = readyHouses;
