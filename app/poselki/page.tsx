
import { getCmsCopy } from "../../lib/cms-store";
import { SitePage } from "../../components/site-page";
import type { Metadata } from "next";
import { CompletedSettlementCards } from "../../components/completed-settlement-cards";
import { HomeExcursion } from "../../components/home-excursion";
import { HomeSettlementsMap } from "../../components/home-settlements-map";
import { SettlementListing } from "../../components/settlement-listing";
import { createPageMetadata, localizePageMetadata } from "../../lib/site-metadata";
import { sitePath, siteSrcSet } from "../../lib/site-path";
import settlementStyles from "../../components/settlements.module.css";
import styles from "./page.module.css";

const title = "Коттеджные посёлки в Ленинградской области — Удачный посёлок";
const description = "Посёлки в продаже и реализованные проекты компании «Удачный посёлок». Выберите район и запишитесь на экскурсию.";
const cover = "/images/settlements/catalog-cover.webp";
const coverSources = siteSrcSet(`/images/settlements/catalog-cover-1024.webp 1024w, ${cover} 2400w`);
const coverId = "settlements-cover";

const baseMetadata: Metadata = createPageMetadata({title,description,path:'/poselki',siteName:'Удачный посёлок',image:{src:cover,alt:'Осенний пейзаж в Ленинградской области'}});

export default async function SettlementCatalogPage() {
  const cms = await getCmsCopy();

  return (
    <SitePage className={`${styles.page} ${settlementStyles.compactCards}`} coverId="settlements-cover" mainId="settlements-main">

        <section className={`shell ${styles.cover}`} id={coverId} data-cover-motion aria-labelledby="settlements-title">
          <picture data-cover-parallax>
            <source media="(max-width: 767px)" srcSet={sitePath(cms.text("copy.poselki.1", "/images/settlements/catalog-cover-1024.webp"))} />
            <img src={sitePath(cover)} srcSet={coverSources} sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1920px) 96vw, 1840px" alt="" fetchPriority="high" />
          </picture>
          <h1 id="settlements-title">{cms.text("copy.poselki.2", "Коттеджные ")}<em>{cms.text("copy.poselki.3", "посёлки")}</em></h1>
        </section>
        <section className={settlementStyles.section} data-catalog aria-labelledby="settlements-for-sale">
          <h2 className={`shell ${settlementStyles.heading} ${settlementStyles.catalogHeading}`} id="settlements-for-sale">
            {cms.text("copy.poselki.4", "Посёлки ")}<em>{cms.text("copy.poselki.5", "в продаже")}</em>
          </h2>
          <SettlementListing
            wrapOnTablet
            resultsId="settlements-for-sale-results"
          />
        </section>
        <HomeSettlementsMap />
        <HomeExcursion />
        <section className={`${settlementStyles.section} ${styles.completed}`} aria-labelledby="completed-settlements">
          <h2 className={`shell ${settlementStyles.heading} ${settlementStyles.catalogHeading}`} id="completed-settlements">
            <em>{cms.text("copy.poselki.6", "Реализованные")}</em> {cms.text("copy.poselki.7", " посёлки")}</h2>
          <CompletedSettlementCards />
        </section>
    </SitePage>
  );
}

export async function generateMetadata() {
  const cms = await getCmsCopy();
  return localizePageMetadata(baseMetadata, cms, "poselki");
}
