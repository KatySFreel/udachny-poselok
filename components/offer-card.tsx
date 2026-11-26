"use client";
import { useCmsCopy } from "./cms-provider";


import { sitePath } from "../lib/site-path";
type OfferCardProps = {
  title: string;
  titleLines: readonly string[];
  href: string;
  image: string;
  width: number;
  height: number;
  crop: "certificate" | "installment";
};

export function OfferCard({ title, titleLines, href, image, width, height, crop }: OfferCardProps) {
  const cms = useCmsCopy();

  return (
    <a className="offer-card" href={sitePath(href)} aria-label={`Смотреть: ${title}`}>
      <div className={`offer-card__photo offer-card__photo--${crop}`}>
        <img src={sitePath(image)} alt="" width={width} height={height} />
      </div>
      <div className="offer-card__body">
        <h2>{titleLines.map((line) => <span key={line}>{line}{" "}</span>)}</h2>
        <span className="offer-card__link">{cms.text("copy.offer-card.1", "Смотреть")}</span>
      </div>
    </a>
  );
}
