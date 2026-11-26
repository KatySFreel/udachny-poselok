"use client";
import { useCmsCopy } from "./cms-provider";


import { siteSrcSet, sitePath } from "../lib/site-path";
import { useLoopingCarousel } from "./use-looping-carousel";
import { LoopingCarouselTrack } from "./looping-carousel-track";
import { CarouselControls } from "./carousel-controls";
import { reviews, reviewsSource } from "../content/reviews";
import shared from "./settlements.module.css";
import styles from "./home-reviews.module.css";

const assets = "/images/reviews";
const autoplayDelay = 5000;

type Review = (typeof reviews)[number];

function ReviewCard({ id, name, role, quote, featured }: Review) {
  const quoteImage = featured ? "quote-accent" : "quote";

  return (
    <li className={featured ? `${styles.card} ${styles.featured}` : styles.card}>
      {featured && (
        <picture className={styles.pattern}>
          <source media="(width < 1024px)" srcSet={siteSrcSet(`${assets}/pattern-tablet.svg`)} width={426} height={407} />
          <source media="(width <= 1280px)" srcSet={siteSrcSet(`${assets}/pattern-compact.svg`)} width={426} height={407} />
          <img src={sitePath(`${assets}/pattern.svg`)} alt="" width={327} height={377.308} />
        </picture>
      )}
      <picture className={styles.quoteMark}>
        <source media="(width < 768px)" srcSet={siteSrcSet(`${assets}/${quoteImage}-mobile.svg`)} width={32} height={25} />
        <img src={sitePath(`${assets}/${quoteImage}.svg`)} alt="" width={58.907} height={46.194} />
      </picture>
      <blockquote className={styles.quote}><p>{quote}</p></blockquote>
      <div className={styles.author}>
        <img src={sitePath(`${assets}/${id}.webp`)} alt="" width={180} height={180} loading="lazy" />
        <div>
          <p className={styles.name}>{name}</p>
          <p>{role}</p>
        </div>
      </div>
    </li>
  );
}

export function HomeReviews() {
  const cms = useCmsCopy();
  const reviewsSource = cms.data("data.reviewsSource", _cmsSource_reviewsSource);
  const reviews = cms.data("data.reviews", _cmsSource_reviews);

  const { carousel, viewport, move, onKeyDown } = useLoopingCarousel({ count: reviews.length, delay: autoplayDelay, transitionDuration: 600 });

  return (
    <section className={styles.section} aria-labelledby="home-reviews-title">
      <div className="shell">
        <div className={shared.sectionLabel}>{cms.text("copy.home-reviews.1", "Отзывы")}</div>
        <h2 className={`${shared.heading} ${styles.heading}`} id="home-reviews-title">
          {cms.text("copy.home-reviews.2", "Истории тех, ")}<em><span>{cms.text("copy.home-reviews.3", "кто")}</span> {cms.text("copy.home-reviews.4", " уже выбрал нас")}</em>
        </h2>
      </div>
      <div ref={carousel}>
        <CarouselControls className={styles.controls} viewportId="home-reviews-viewport"
          label={cms.text("copy.home-reviews.5", "Навигация по отзывам")} previousLabel="Предыдущий отзыв" nextLabel="Следующий отзыв"
          onPrevious={() => move.current(-1)} onNext={() => move.current(1)} />
        <div ref={viewport} id="home-reviews-viewport" className={`carousel-viewport ${styles.viewport}`} role="group" aria-label={cms.text("copy.home-reviews.6", "Отзывы покупателей")} tabIndex={0} onKeyDown={onKeyDown}>
          <LoopingCarouselTrack as="ul" slidesClassName={styles.slides}>
            {() => reviews.map(review => <ReviewCard key={review.id} {...review} />)}
          </LoopingCarouselTrack>
        </div>
      </div>
      <div className={`shell ${styles.footer}`}>
        <p className={styles.rating}>
          <img src={sitePath(`${assets}/star.svg`)} alt="" width={24} height={23} />
          <strong>{reviewsSource.rating}</strong> <span>{cms.text("copy.home-reviews.7", "из 5 на Яндекс Картах")}</span>
        </p>
        <a href={reviewsSource.href}>{cms.text("copy.home-reviews.8", "Читать все отзывы")}</a>
      </div>
    </section>
  );
}

const _cmsSource_reviews = reviews;

const _cmsSource_reviewsSource = reviewsSource;
