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
  return (
    <a className="offer-card" href={sitePath(href)} aria-label={`Смотреть: ${title}`}>
      <div className={`offer-card__photo offer-card__photo--${crop}`}>
        <img src={sitePath(image)} alt="" width={width} height={height} />
      </div>
      <div className="offer-card__body">
        <h2>{titleLines.map((line) => <span key={line}>{line}{" "}</span>)}</h2>
        <span className="offer-card__link">Смотреть</span>
      </div>
    </a>
  );
}
