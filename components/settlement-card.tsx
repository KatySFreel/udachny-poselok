import { sitePath, siteSrcSet } from "../lib/site-path";
import type { CompletedSettlement, Settlement } from "../content/settlements";
import styles from "./settlements.module.css";

const priceFormatter = new Intl.NumberFormat("ru-RU");
const photoSizes = "(width < 768px) calc(100vw - 40px), (width < 1024px) calc((100vw - 50px) / 2), (max-width: 1280px) calc((95.8333vw - 40px) / 3), (max-width: 1920px) calc((95.8333vw - 60px) / 4), 445px";

function photoSources(src: string, width: number) {
  return `${src.replace(".webp", "-480.webp")} 480w, ${src} ${width}w`;
}

export function SettlementCard({
  settlement,
  onOpen,
}: {
  settlement: Settlement | CompletedSettlement;
  onOpen?: () => void;
}) {
  const { slug, name, location } = settlement;
  const listing = "price" in settlement ? settlement : undefined;
  const { widePhoto, photoWidth = 880 } = listing ?? {};
  const photo = listing
    ? `/images/settlements/${slug}.webp`
    : `/images/settlements/completed/${slug}.webp`;
  const highlights = "year" in settlement ? [`${settlement.year} год`] : settlement.highlights;

  const content = (
    <>
      <div className={styles.photoBox}>
        <picture className={styles.photo}>
          {widePhoto && (
            <source media="(width > 1280px)" srcSet={siteSrcSet(photoSources(widePhoto, 880))} sizes={photoSizes} />
          )}
          <img src={sitePath(photo)} srcSet={siteSrcSet(photoSources(photo, photoWidth))} sizes={photoSizes} alt={name} loading="lazy" decoding="async" />
        </picture>
        <ul className={styles.tags}>
          {highlights.map((highlight) => typeof highlight === "string" ? (
            <li key={highlight}>{highlight}</li>
          ) : (
            <li className={styles.adaptiveTag} key={highlight.label}>
              <span className={styles.fullLabel}>{highlight.label}</span>
              <span className={styles.shortLabel}>{highlight.shortLabel}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.location}>
          <img src={sitePath("/icons/settlement-location.svg")} alt="" width={13.125} height={16.8791} />
          {location}
        </p>
        <h3 className={styles.cardTitle} id={`settlement-${slug}`}>{name}</h3>
        <div className={styles.priceRow}>
          {listing && <p>От {priceFormatter.format(listing.price)} ₽</p>}
          <span className={styles.arrow} aria-hidden="true" />
        </div>
      </div>
    </>
  );

  return listing ? (
    <a className={styles.card} href={sitePath(`/poselki/${slug}`)} aria-labelledby={`settlement-${slug}`}>
      {content}
    </a>
  ) : (
    <article className={`${styles.card} ${styles.completedCard}`} aria-labelledby={`settlement-${slug}`}>
      {content}
      {onOpen && (
        <button
          className={styles.cardTrigger}
          type="button"
          aria-labelledby={`settlement-${slug}`}
          aria-haspopup="dialog"
          onClick={onOpen}
        />
      )}
    </article>
  );
}
