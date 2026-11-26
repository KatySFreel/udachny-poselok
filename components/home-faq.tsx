"use client";
import { useCmsCopy } from "./cms-provider";


import { faq } from "../content/faq";
import shared from "./settlements.module.css";
import styles from "./home-faq.module.css";

export function HomeFaq() {
  const cms = useCmsCopy();
  const faq = cms.data("data.faq", _cmsSource_faq);

  return (
    <section className={`shell ${styles.section}`} id="faq" aria-labelledby="home-faq-title">
      <div className={shared.sectionLabel}>{cms.text("copy.home-faq.1", "Частые вопросы")}</div>
      <h2 className={`${shared.heading} ${styles.heading}`} id="home-faq-title">
        {cms.text("copy.home-faq.2", "Что важно знать ")}<em>{cms.text("copy.home-faq.3", "перед покупкой?")}</em>
      </h2>
      <div className={styles.list}>
        {faq.map(({ question, answer }, index) => (
          <details className={styles.item} name="home-faq" open={index === 0} key={question}>
            <summary className={styles.summary}>
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.question}>{question}</span>
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <div className={styles.answer}>
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

const _cmsSource_faq = faq;
