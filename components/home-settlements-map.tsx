import styles from "./home-settlements-map.module.css";
import { HomeSettlementsMapBoard } from "./home-settlements-map-board";

export function HomeSettlementsMap() {
  return (
    <section className={`shell ${styles.section}`} aria-labelledby="home-settlements-map-title">
      <h2 className={styles.heading} id="home-settlements-map-title">
        Все&nbsp;посёлки <em>на&nbsp;одной карте</em>
      </h2>
      <HomeSettlementsMapBoard />
    </section>
  );
}
