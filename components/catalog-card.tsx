import { ActionLabel } from "./action";
import { ImageStack } from "./image-stack";
import { sitePath, siteSrcSet } from "../lib/site-path";
import styles from "./catalog-card.module.css";

type CatalogCardProps = {
  href: string;
  label: string;
  title: string;
  imageDirectory: string;
  pattern: { src: string; tablet: string; desktop?: string; width: number };
  className?: string;
  patternClassName?: string;
};

const photoNumbers = [1, 2, 3, 4];

export function CatalogCard({
  href,
  label,
  title,
  imageDirectory,
  pattern,
  className,
  patternClassName = styles.catalogPattern,
}: CatalogCardProps) {
  return (
    <a className={className ? `${styles.catalogCard} ${className}` : styles.catalogCard} href={sitePath(href)} aria-label={label}>
      <picture className={patternClassName}>
        <source media="(width < 1024px)" srcSet={siteSrcSet(pattern.tablet)} />
        {pattern.desktop && <source media="(max-width: 1280px)" srcSet={siteSrcSet(pattern.desktop)} />}
        <img src={sitePath(pattern.src)} alt="" width={pattern.width} height={600} loading="lazy" />
      </picture>
      <div className={styles.catalogIntro}>
        <ImageStack className={styles.catalogPhotos} images={photoNumbers.map(number => `${imageDirectory}/catalog-${number}.webp`)} />
        <p>{title}</p>
      </div>
      <ActionLabel variant="light" arrow iconSrc="/icons/settlement-catalog-arrow.svg">Смотреть все</ActionLabel>
    </a>
  );
}
