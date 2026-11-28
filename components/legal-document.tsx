"use client";
import { useCmsCopy } from "./cms-provider";


import { ActionLink } from "./action";
import { SitePage } from "./site-page";
import { sitePath } from "../lib/site-path";
import styles from "./legal-document.module.css";

type LegalSection = { heading?: string; paragraphs: readonly string[] };

export function LegalDocument({ id, title, sections, variant = 'sections', homeLabel }: {
  id: string;
  title: string;
  sections: readonly LegalSection[];
  variant?: 'sections' | 'consent';
  homeLabel?: string;
}) {
  const cms = useCmsCopy();

  return <SitePage className={`${styles.page}${variant === 'consent' ? ` ${styles.consent}` : ''}`} coverId={`${id}-cover`} mainId={`${id}-main`}>
    <article id={`${id}-cover`} className={styles.document} aria-labelledby={`${id}-title`}>
      <h1 id={`${id}-title`}>{title}</h1>
      <div className={styles.sections}>
        {sections.map(({ heading, paragraphs }, index) => <section className={styles.section} key={heading || index}
          aria-labelledby={heading ? `${id}-section-${index}` : undefined}>
          {heading && <h2 id={`${id}-section-${index}`}>{heading}</h2>}
          {paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
        </section>)}
      </div>
      <ActionLink className={styles.homeLink} href={sitePath("/")} arrow>{homeLabel ?? cms.text("copy.legal-document.1", "На главную страницу")}</ActionLink>
    </article>
  </SitePage>;
}
