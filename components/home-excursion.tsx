import { ExcursionForm } from "./excursion-form";
import styles from "./home-excursion.module.css";

export function HomeExcursion({ catalog = false }: { catalog?: boolean }) {
  return (
    <section className={`shell ${styles.section}`} data-catalog={catalog || undefined} aria-labelledby="home-excursion-title">
      <div className={styles.frame}>
        <div className={styles.photo} />
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
          <ExcursionForm successDisplay={catalog ? "inline" : "dialog"} />
        </div>
      </div>
    </section>
  );
}
