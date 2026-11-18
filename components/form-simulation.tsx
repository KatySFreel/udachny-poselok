"use client";

import { createContext, useState, type ReactNode } from "react";
import styles from "./contact-form.module.css";

type Outcome = "success" | "error";
export const FormTest = createContext<{ outcome: Outcome; enabled: boolean }>({
  outcome: "success",
  enabled: false,
});
export const submissionError = "Не удалось отправить заявку. Попробуйте ещё раз.";

export function FormSimulation({ children }: { children: ReactNode }) {
  const [outcome, setOutcome] = useState<Outcome>("success");
  return (
    <FormTest.Provider value={{ outcome, enabled: true }}>
      {children}
      <button
        className={styles.testMode}
        type="button"
        aria-label="Имитировать ошибку отправки"
        aria-pressed={outcome === "error"}
        onClick={() => setOutcome((current) => current === "success" ? "error" : "success")}
      >
        Тест форм: {outcome === "success" ? "успех" : "ошибка"}
      </button>
    </FormTest.Provider>
  );
}

// Replace this transport with the service integration when it is available.
export async function simulateSubmission(outcome: Outcome) {
  await new Promise<void>((resolve) => setTimeout(resolve, 550));
  return outcome;
}
