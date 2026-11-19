import { ExcursionForm } from "./excursion-form";
import { sitePath } from "../lib/site-path";
import styles from "./home-excursion.module.css";

export function HomeExcursion() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-excursion-title">
      <div className={styles.frame}>
        <picture className={styles.photo}>
          <source media="(max-width: 1023px)" srcSet={sitePath("/images/excursion-family-900.webp")} />
          <img src={sitePath("/images/excursion-family.webp")} alt="" width={1254} height={1254} loading="lazy" decoding="async" />
        </picture>
        <div className={styles.panel}>
          <div className={styles.intro}>
            <h2 id="home-excursion-title">
              Увидеть всё <em>своими глазами</em>
            </h2>
            <p data-reveal>
              Запишитесь на экскурсию<br className={styles.mobileDescriptionBreak} />{" "}
              и познакомьтесь<br className={styles.descriptionBreak} />{" "}
              с нашими посёлками.
            </p>
          </div>
          <ExcursionForm />
        </div>
      </div>
    </section>
  );
}
