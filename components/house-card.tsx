import { sitePath, siteSrcSet } from "../lib/site-path";
import type { House } from "../content/houses";
import styles from "./home-houses.module.css";
import shared from "./settlements.module.css";

const priceFormatter = new Intl.NumberFormat("ru-RU");
const singleColumnSizes = "(width < 1024px) calc(100vw - 40px)";
const projectSizes = `${singleColumnSizes}, (max-width: 1919px) calc((95.833vw - 40px) / 3), 600px`;
const readySizes = `${singleColumnSizes}, (max-width: 1919px) calc((95.833vw - 20px) / 2), 910px`;

function HousePhoto({ slug, width, sizes, alt }: { slug: string; width: number; sizes: string; alt: string }) {
  const path = `/images/houses/${slug}`;
  return (
    <img
      src={sitePath(`${path}.webp`)}
      srcSet={siteSrcSet(`${path}-560.webp 560w, ${path}.webp ${width}w`)}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export function HouseCard({ house, ready = false }: { house: House; ready?: boolean }) {
  const { slug, name, price, imageWidth, tags } = house;
  const sizes = ready ? readySizes : projectSizes;
  const titleId = `house-${slug}`;

  return (
    <a className={`${shared.card} ${styles.card}`} href={sitePath(`/doma/${ready ? "gotovye" : "proekty"}/${slug}`)} aria-labelledby={titleId}>
      <div className={styles.photo}>
        <div className={slug === "resten" ? styles.layeredPhoto : styles.photoImages} data-house={slug}>
          <HousePhoto slug={slug} width={imageWidth} sizes={sizes} alt={`Внешний вид дома «${name}»`} />
          {slug === "resten" && <HousePhoto slug="resten-extra" width={940} sizes={sizes} alt="" />}
        </div>
        <ul className={styles.tags}>
          {tags.map(({ icon, label }) => (
            <li key={icon}>
              <img src={sitePath(`/icons/house-${icon}.svg`)} alt="" width={24} height={24} loading="lazy" />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className={shared.cardBody}>
        <h3 className={shared.cardTitle} id={titleId}>{name}</h3>
        <div className={shared.priceRow}>
          <p>{ready ? "" : "От "}{priceFormatter.format(price)} ₽</p>
          <span className={shared.arrow} aria-hidden="true" />
        </div>
      </div>
    </a>
  );
}
