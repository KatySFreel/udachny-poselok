import { Quiz } from "./quiz";
import styles from "./home-quiz.module.css";

export function HomeQuiz() {
  return (
    <section className={`shell ${styles.section}`} id="home-quiz" aria-labelledby="home-quiz-title">
      <Quiz />
    </section>
  );
}
