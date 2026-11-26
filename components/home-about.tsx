"use client";
import { useCmsCopy } from "./cms-provider";


import { sitePath, siteSrcSet } from "../lib/site-path";
import styles from "./home-about.module.css";
import shared from "./settlements.module.css";
import { RoundLink } from "./round-link";

export function HomeAbout() {
  const cms = useCmsCopy();

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-about-title">
      <div className={styles.panel} data-header-theme="light">
        <div className={styles.intro}>
          <div className={`${shared.sectionLabel} ${styles.label}`}>{cms.text("copy.home-about.1", "О компании")}</div>
          <h2 id="home-about-title">
            {cms.text("copy.home-about.2", "Создаём пространство для жизни за городом —")}{" "}
            <em>{cms.text("copy.home-about.3", "от выбора участка до собственного дома")}</em>
          </h2>
        </div>
        <img
          className={styles.team}
          data-reveal
          src={sitePath(cms.text("copy.home-about.4", "/images/about/team.webp"))}
          srcSet={cms.imageSet("copy.home-about.4", siteSrcSet(cms.text("copy.home-about.5", "/images/about/team-720.webp 720w, /images/about/team.webp 1536w")))}
          sizes="(width < 768px) calc(100vw - 64px), (width < 1024px) min(670px, calc(100vw - 98px)), (max-width: 1919px) 48vw, 910px"
          width={1536}
          height={1024}
          alt={cms.text("copy.home-about.6", "Команда «Удачного посёлка» в офисе")}
          loading="lazy"
          decoding="async"
        />
        <img
          className={styles.office}
          src={sitePath(cms.text("copy.home-about.7", "/images/about/office-sign.webp"))}
          width={420}
          height={280}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <p className={styles.description} data-reveal>
          {cms.text("copy.home-about.8", "«Удачный посёлок» появился в 2018 году с идеей сделать загородную жизнь доступнее и помочь людям найти место, которое станет по‑настоящему своим. За это время компания прошла путь от первых проектов до развития целых коттеджных посёлков в Ленинградской области.")}</p>
        <RoundLink className={styles.more} href={sitePath("/o-kompanii")} label={cms.text("copy.home-about.9", "Подробнее")} aria-label={cms.text("copy.home-about.10", "Подробнее о компании")} />
      </div>
    </section>
  );
}
