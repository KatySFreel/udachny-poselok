import type { CSSProperties } from "react";
import { sitePath } from "../lib/site-path";
import shared from "./settlements.module.css";
import styles from "./payment-card.module.css";
import interaction from "./link-card-interaction.module.css";
import reveal from "./card-reveal.module.css";

export type PaymentOption = {
  href?: string;
  title: string;
  description?: string;
  number: { id: string; width: number; height: number; src?: string };
};

export function PaymentCard({ option, headingId, variant, revealOrder }: { option: PaymentOption; headingId: string; variant?: 'installment'; revealOrder?: number }) {
  const { href, title, description, number } = option;
  const content = <>
    {href && <span className={`${shared.arrow} ${styles.arrow} ${interaction.arrow}`} aria-hidden="true" />}
    <div className={`${styles.number}${revealOrder !== undefined ? ` ${reveal.media}` : ''}`} style={{ "--number-width": number.width } as CSSProperties}>
      <img src={sitePath(number.src ?? `/images/payment/${number.id}.svg`)} alt="" width={number.width} height={number.height} loading="lazy" />
    </div>
    <div className={styles.body}>
      <h3 className={`${shared.cardTitle} ${interaction.title}`} id={headingId}>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  </>;
  const props = { className: `${styles.card} ${interaction.card}${revealOrder !== undefined ? ` ${reveal.card}` : ''}`, "data-reveal": revealOrder !== undefined || undefined, style: revealOrder !== undefined ? {"--card-reveal-order": revealOrder} as CSSProperties : undefined, "data-variant": variant ?? (description ? "description" : "title"), "data-number": number.id, "aria-labelledby": headingId };
  return href ? <a {...props} href={sitePath(href)}>{content}</a> : <div {...props}>{content}</div>;
}
