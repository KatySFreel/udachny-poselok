import { sitePath } from "../lib/site-path";
import styles from "./home-settlements-map.module.css";

export function HomeSettlementsMap({ catalog = false }: { catalog?: boolean }) {
  return (
    <section className={`shell ${styles.section}`} data-catalog={catalog || undefined} aria-labelledby="home-settlements-map-title">
      <h2 className={styles.heading} id="home-settlements-map-title">
        Все&nbsp;посёлки <em>на&nbsp;одной карте</em>
      </h2>
      <img
        data-reveal
        className={styles.map}
        src={sitePath("/images/settlements-map.webp")}
        alt="Расположение коттеджных посёлков относительно Санкт-Петербурга"
        width={1024}
        height={702}
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
