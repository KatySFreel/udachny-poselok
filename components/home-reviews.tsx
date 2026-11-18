"use client";

import { siteSrcSet, sitePath } from "../lib/site-path";
import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
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
  const carousel = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const move = useRef<(direction: number) => void>(() => {});

  useLayoutEffect(() => {
    if (!viewport.current || !carousel.current) return;
    const rail = viewport.current;
    const slider = carousel.current;
    const row = rail.firstElementChild;
    if (!row) return;
    const [before, original] = Array.from(row.children) as HTMLElement[];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cycle = 0;
    let inView = false;
    let touching = false;
    let target: number | undefined;
    let autoplayTimer: number;
    let settleTimer: number;

    function measure() {
      const nextCycle = original.offsetLeft - before.offsetLeft;
      if (!nextCycle || nextCycle === cycle) return;
      const index = cycle ? Math.round(rail.scrollLeft * reviews.length / cycle) % reviews.length : 0;
      cycle = nextCycle;
      target = undefined;
      rail.scrollLeft = cycle + cycle * index / reviews.length;
    }

    function settled() {
      target = undefined;
      const left = rail.scrollLeft;
      // Shift to the equivalent position in the middle copy, with the same cards visible.
      if (left < cycle - 1 || left >= 2 * cycle - 1) {
        rail.scrollLeft = left < cycle - 1 ? left + cycle : left - cycle;
      }
    }

    function schedule() {
      window.clearTimeout(autoplayTimer);
      if (!inView || motion.matches || document.hidden) return;
      autoplayTimer = window.setTimeout(() => {
        if (!touching && !slider.matches(":hover") && !slider.querySelector(":focus-visible")) {
          advance(1);
        } else {
          schedule();
        }
      }, autoplayDelay);
    }

    function advance(direction: number) {
      if (!cycle) return;
      const step = cycle / reviews.length;
      const next = (Math.round((target ?? rail.scrollLeft) / step) + direction) * step;
      target = Math.max(0, Math.min(next, rail.scrollWidth - rail.clientWidth));
      rail.scrollTo({ left: target, behavior: motion.matches ? "instant" : "smooth" });
      schedule();
    }

    function onScroll() {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settled, 140);
      if (target === undefined) schedule();
    }

    function onTouchStart() {
      target = undefined;
      touching = true;
    }

    function onTouchEnd() {
      touching = false;
      schedule();
    }

    move.current = advance;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    }, { threshold: 0.2 });
    visibility.observe(rail);
    rail.addEventListener("scroll", onScroll, { passive: true });
    rail.addEventListener("touchstart", onTouchStart, { passive: true });
    rail.addEventListener("touchend", onTouchEnd);
    rail.addEventListener("touchcancel", onTouchEnd);
    slider.addEventListener("mouseleave", schedule);
    slider.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);

    return () => {
      move.current = () => {};
      window.clearTimeout(autoplayTimer);
      window.clearTimeout(settleTimer);
      resize.disconnect();
      visibility.disconnect();
      rail.removeEventListener("scroll", onScroll);
      rail.removeEventListener("touchstart", onTouchStart);
      rail.removeEventListener("touchend", onTouchEnd);
      rail.removeEventListener("touchcancel", onTouchEnd);
      slider.removeEventListener("mouseleave", schedule);
      slider.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move.current(event.key === "ArrowRight" ? 1 : -1);
  }

  return (
    <section className={styles.section} aria-labelledby="home-reviews-title">
      <div className="shell">
        <div className={shared.sectionLabel}>Отзывы</div>
        <h2 className={`${shared.heading} ${styles.heading}`} id="home-reviews-title">
          Истории тех, <em><span>кто</span> уже выбрал нас</em>
        </h2>
      </div>
      <div ref={carousel}>
        <div className={styles.controls} role="group" aria-label="Навигация по отзывам">
          <button type="button" aria-controls="home-reviews-viewport" aria-label="Предыдущий отзыв" onClick={() => move.current(-1)} />
          <button type="button" aria-controls="home-reviews-viewport" aria-label="Следующий отзыв" onClick={() => move.current(1)} />
        </div>
        <div ref={viewport} id="home-reviews-viewport" className={styles.viewport} role="group" aria-label="Отзывы покупателей" tabIndex={0} onKeyDown={onKeyDown}>
          <div className={styles.row}>
            {["before", "original", "after"].map((copy) => (
              <ul key={copy} className={styles.slides} aria-hidden={copy !== "original" || undefined}>
                {reviews.map((review) => <ReviewCard key={review.id} {...review} />)}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className={`shell ${styles.footer}`}>
        <p className={styles.rating}>
          <img src={sitePath(`${assets}/star.svg`)} alt="" width={24} height={23} />
          <strong>{reviewsSource.rating}</strong> <span>из 5 на Яндекс Картах</span>
        </p>
        <a href={reviewsSource.href}>Читать все отзывы</a>
      </div>
    </section>
  );
}
