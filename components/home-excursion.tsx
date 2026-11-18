import { ExcursionForm } from "./excursion-form";
import styles from "./home-excursion.module.css";

export function HomeExcursion() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-excursion-title">
      <div className={styles.frame}>
        <div className={styles.photo} />
        <div className={styles.panel}>
          <div className={styles.intro}>
            <h2 id="home-excursion-title">
              Увидеть всё <em>своими глазами</em>
            </h2>
            <p data-reveal>
              Запишитесь на экскурсию и познакомьтесь<br className={styles.descriptionBreak} />{" "}
              с нашими посёлками.
            </p>
          </div>
          <ExcursionForm />
        </div>
      </div>
    </section>
  );
}
