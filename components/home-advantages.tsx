"use client";
import { useCmsCopy } from "./cms-provider";


import { siteSrcSet, sitePath } from "../lib/site-path";
import { homeAdvantages } from "../content/home";
import styles from "./home-advantages.module.css";

function AdvantageFacts({
  facts,
}: {
  facts: readonly { value: readonly string[]; label: string }[];
}) {
  return (
    <ul className={styles.facts}>
      {facts.map(({ value, label }) => (
        <li className={styles.fact} key={label}>
          <p className={styles.value}>
            {value.map((line) => <span key={line}>{line}{" "}</span>)}
          </p>
          <p className={styles.label}>{label}</p>
        </li>
      ))}
    </ul>
  );
}

export function HomeAdvantages() {
  const cms = useCmsCopy();
  const homeAdvantages = cms.data("data.homeAdvantages", _cmsSource_homeAdvantages);

  const { title, emphasis, description, firstFacts, secondFacts } = homeAdvantages;

  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-advantages-title">
      <h2 className={styles.heading} id="home-advantages-title">
        {title} <em>{emphasis}</em>
      </h2>
      <p className={styles.description} data-reveal>{description}</p>
      <div className={styles.composition} data-reveal>
        <AdvantageFacts facts={firstFacts} />
        <div className={styles.photo}>
          <picture className={styles.ring}>
            <source media="(width > 1280px)" srcSet={cms.imageSet("copy.home-advantages.3", siteSrcSet(cms.text("copy.home-advantages.1", "/images/advantages-ring-wide.webp")))} />
            <source media="(width < 768px)" srcSet={cms.imageSet("copy.home-advantages.3", siteSrcSet(cms.text("copy.home-advantages.2", "/images/advantages-ring-mobile.webp")))} />
            <img src={sitePath(cms.text("copy.home-advantages.3", "/images/advantages-ring-desktop.webp"))} alt="" width={748} height={748} loading="lazy" />
          </picture>
          <picture className={styles.family}>
            <source media="(width > 1280px)" srcSet={cms.imageSet("copy.home-advantages.6", siteSrcSet(cms.text("copy.home-advantages.4", "/images/advantages-family-wide.webp")))} />
            <source media="(width < 768px)" srcSet={cms.imageSet("copy.home-advantages.6", siteSrcSet(cms.text("copy.home-advantages.5", "/images/advantages-family-mobile.webp")))} />
            <img src={sitePath(cms.text("copy.home-advantages.6", "/images/advantages-family-desktop.webp"))} alt="" width={720} height={720} loading="lazy" />
          </picture>
        </div>
        <AdvantageFacts facts={secondFacts} />
      </div>
    </section>
  );
}

const _cmsSource_homeAdvantages = homeAdvantages;
