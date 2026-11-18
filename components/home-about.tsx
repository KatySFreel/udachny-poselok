import { sitePath, siteSrcSet } from "../lib/site-path";
import styles from "./home-about.module.css";
import shared from "./settlements.module.css";

export function HomeAbout() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-about-title">
      <div className={styles.panel} data-header-theme="light">
        <div className={styles.intro}>
          <div className={`${shared.sectionLabel} ${styles.label}`}>О компании</div>
          <h2 id="home-about-title">
            Создаём пространство для жизни за городом —{" "}
            <em>от выбора участка до собственного дома</em>
          </h2>
        </div>
        <img
          className={styles.team}
          data-reveal
          src={sitePath("/images/about/team.webp")}
          srcSet={siteSrcSet("/images/about/team-720.webp 720w, /images/about/team.webp 1536w")}
          sizes="(width < 768px) calc(100vw - 64px), (width < 1024px) min(670px, calc(100vw - 98px)), (max-width: 1919px) 48vw, 910px"
          width={1536}
          height={1024}
          alt="Команда «Удачного посёлка» в офисе"
          loading="lazy"
          decoding="async"
        />
        <img
          className={styles.office}
          src={sitePath("/images/about/office-sign.webp")}
          width={420}
          height={280}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <p className={styles.description} data-reveal>
          «Удачный посёлок» появился в 2018 году с идеей сделать загородную жизнь доступнее и помочь людям
          найти место, которое станет по‑настоящему своим. За это время компания прошла путь от первых проектов
          до развития целых коттеджных посёлков в Ленинградской области.
        </p>
        <a className={styles.more} href={sitePath("/o-kompanii")} aria-label="Подробнее о компании">
          <picture className={styles.seal}>
            <source media="(width < 768px)" srcSet={siteSrcSet("/images/about/seal-mobile.svg")} width={165} height={172} />
            <img src={sitePath("/images/about/seal.svg")} width={255.41} height={267.243} alt="" loading="lazy" />
          </picture>
          <span className={styles.moreContent}>
            <span className={styles.moreLabel}>Подробнее</span>
            <span className="action__icon" aria-hidden="true">
              <picture>
                <source media="(width < 768px)" srcSet={siteSrcSet("/icons/settlement-arrow-mobile.svg")} width={18.3848} height={18.3848} />
                <img src={sitePath("/icons/arrow.svg")} width={24.513} height={24.513} alt="" />
              </picture>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
