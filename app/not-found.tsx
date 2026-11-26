import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { RoundLink } from "../components/round-link";
import { sitePath } from "../lib/site-path";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 — Страница не найдена | Удачный посёлок",
  description: "Кажется, такой страницы не существует или адрес страницы набран неверно.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className={`cover-header-page ${styles.page}`}>
      <SiteHeader coverId="not-found-cover" />
      <main id="not-found-cover" className={styles.screen}>
        <img className={styles.background} src={sitePath("/images/not-found/meadow.webp")} alt="" fetchPriority="high" />
        <div className={styles.composition}>
          <div className={styles.copy}>
            <h1 aria-label="404 — Страница не найдена" data-motion="entering">
              <img src={sitePath("/images/not-found/404.svg")} width={370.915} height={158.786} alt="404" />
            </h1>
            <p>Кажется, такой страницы не существует или адрес страницы набран неверно. Попробуйте ещё раз или перейдите на главную страницу сайта</p>
          </div>
          <RoundLink className={styles.homeLink} variant="not-found" label="На главную" mobileLabel="Подробнее" aria-label="На главную" href={sitePath("/")} />
        </div>
      </main>
    </div>
  );
}
