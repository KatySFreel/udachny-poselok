import type { Metadata } from "next";
import { CompletedSettlementCards } from "../../components/completed-settlement-cards";
import { HomeExcursion } from "../../components/home-excursion";
import { HomeSettlementsMap } from "../../components/home-settlements-map";
import { PageMotion } from "../../components/page-motion";
import { SettlementCard } from "../../components/settlement-card";
import { SettlementFilterGrid } from "../../components/settlement-filter-grid";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { settlements } from "../../content/settlements";
import { canonicalUrl, indexable, metadataBase } from "../../lib/site-metadata";
import { sitePath, siteSrcSet } from "../../lib/site-path";
import settlementStyles from "../../components/settlements.module.css";
import styles from "./page.module.css";

const title = "Коттеджные посёлки в Ленинградской области — Удачный посёлок";
const description = "Посёлки в продаже и реализованные проекты компании «Удачный посёлок». Выберите район и запишитесь на экскурсию.";
const cover = "/images/settlements/catalog-cover.webp";
const coverSources = siteSrcSet(`/images/settlements/catalog-cover-1024.webp 1024w, ${cover} 2400w`);
const coverId = "settlements-cover";

export const metadata: Metadata = {
  title,
  description,
  ...(indexable && canonicalUrl ? { alternates: { canonical: new URL("/poselki", canonicalUrl) } } : {}),
  openGraph: {
    siteName: "Удачный посёлок",
    title,
    description,
    type: "website",
    locale: "ru_RU",
    ...(metadataBase ? {
      url: new URL(sitePath("/poselki"), metadataBase),
      images: [{ url: new URL(sitePath(cover), metadataBase), alt: "Осенний пейзаж в Ленинградской области" }],
    } : {}),
  },
};

export default function SettlementCatalogPage() {
  return (
    <div className={`${styles.page} cover-header-page`}>
      <SiteHeader coverId={coverId} />
      <main id="settlements-main">
        <section className={`shell ${styles.cover}`} id={coverId} data-cover-motion aria-labelledby="settlements-title">
          <picture>
            <source media="(max-width: 767px)" srcSet={sitePath("/images/settlements/catalog-cover-1024.webp")} />
            <img src={sitePath(cover)} srcSet={coverSources} sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1920px) 96vw, 1840px" alt="" fetchPriority="high" />
          </picture>
          <h1 id="settlements-title">Коттеджные <em>посёлки</em></h1>
        </section>
        <section className={settlementStyles.section} data-catalog aria-labelledby="settlements-for-sale">
          <h2 className={`shell ${settlementStyles.heading} ${settlementStyles.catalogHeading}`} id="settlements-for-sale">
            Посёлки <em>в продаже</em>
          </h2>
          <SettlementFilterGrid
            wrapOnTablet
            resultsId="settlements-for-sale-results"
            cards={settlements.map((settlement) => ({
              id: settlement.slug,
              districtId: settlement.districtId,
              content: <SettlementCard settlement={settlement} />,
            }))}
          />
        </section>
        <HomeSettlementsMap catalog />
        <HomeExcursion />
        <section className={`${settlementStyles.section} ${styles.completed}`} aria-labelledby="completed-settlements">
          <h2 className={`shell ${settlementStyles.heading} ${settlementStyles.catalogHeading}`} id="completed-settlements">
            <em>Реализованные</em> посёлки
          </h2>
          <CompletedSettlementCards />
        </section>
      </main>
      <PageMotion mainId="settlements-main" />
      <SiteFooter />
    </div>
  );
}
