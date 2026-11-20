"use client";

import { useContext, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { submitQuiz } from "@quiz-transport";
import { quizQuestions } from "../content/quiz";
import { site } from "../content/site";
import { ActionButton } from "./action";
import { RequestSuccess } from "./contact-dialog";
import { PhoneField, TextField } from "./form-field";
import { FormTest, simulateSubmission, submissionError } from "./form-simulation";
import { useContactValidation } from "./use-contact-validation";
import fields from "./contact-form.module.css";
import styles from "./home-quiz.module.css";

const total = quizQuestions.length;

export function Quiz() {
  const { outcome, enabled } = useContext(FormTest);
  const { validate, clearField, errorProps, fieldError } = useContactValidation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<"answers" | "unavailable">();
  const [pending, setPending] = useState(false);
  const question = quizQuestions[step];
  const heading = useRef<HTMLHeadingElement>(null);
  const success = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  function select(option: string, checked: boolean) {
    setAnswers((current) => {
      const previous = current[question.id] ?? [];
      const next = checked ? [...previous, option] : previous.filter((item) => item !== option);
      return { ...current, [question.id]: question.multiple ? next : [option] };
    });
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setError(undefined);
    if (!validate(form, data)) return;
    setPending(true);

    try {
      const result = await submitQuiz(data, answers, enabled);
      if (result === "ok" || (result === "simulation" && await simulateSubmission(outcome) === "success")) {
        success.current?.showModal();
        return;
      }
      setError(result === "answers" ? "answers" : "unavailable");
    } catch {
      setError("unavailable");
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setAnswers({});
    setError(undefined);
    setStep(0);
    requestAnimationFrame(() => heading.current?.focus());
  }

  function edit(event: FormEvent<HTMLFormElement>) {
    clearField((event.target as HTMLInputElement).name);
    if (error) setError(undefined);
  }

  return (
    <div className={styles.frame}>
      {question ? (
        <div className={styles.layout}>
          <div className={styles.intro}>
            <h2 className={styles.introTitle} id="home-quiz-title">Подберите участок<br /> в Ленобласти <span>под ваш бюджет</span></h2>
            <p>Ответьте на 5 вопросов и получите презентацию подходящих посёлков с ценами, схемами и вариантами оплаты.</p>
          </div>
          <div className={styles.panel}>
            <div className={styles.progress} style={{ "--quiz-progress": `${(step + 1) / total * 100}%` } as CSSProperties}>
              <progress max={total} value={step + 1} aria-label="Прогресс квиза" />
              <span aria-hidden="true" />
            </div>
            <h3 className={styles.question} id="quiz-question" ref={heading} tabIndex={-1}>{question.title}</h3>
            <fieldset className={styles.options} aria-labelledby="quiz-question" key={question.id}>
              {question.options.map((option) => (
                <label className={styles.option} key={option}>
                  <input
                    type={question.multiple ? "checkbox" : "radio"}
                    name={question.id}
                    value={option}
                    checked={answers[question.id]?.includes(option) ?? false}
                    onChange={(event) => select(option, event.target.checked)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.next}>
              <ActionButton arrow disabled={!answers[question.id]?.length} onClick={() => setStep(step + 1)}>Далее</ActionButton>
            </div>
            <p className={styles.step}>Шаг {step + 1} из {total}</p>
          </div>
        </div>
      ) : (
        <div className={styles.finishLayout}>
          <div className={styles.finish}>
            <div className={styles.finishContent}>
              <h2 id="home-quiz-title" ref={heading} tabIndex={-1}>Получите презентацию посёлков <em>под ваши пожелания</em></h2>
              <p>Оставьте номер телефона, чтобы получить презентацию с расположением посёлков, схемами участков, ценами и условиями покупки</p>
              <form className={styles.form} data-error-layout="flow" method="post" noValidate onSubmit={send} onInput={edit}>
                <div className={styles.inputs}>
                  <div className={fields.field}>
                    <TextField label="Имя" name="name" placeholder="Введите ваше имя" autoComplete="name" maxLength={120} required {...errorProps("name")} />
                    {fieldError("name")}
                  </div>
                  <div className={fields.field}>
                    <TextField label="Email" name="email" type="email" placeholder="Введите ваш email" autoComplete="email" maxLength={254} required {...errorProps("email")} />
                    {fieldError("email")}
                  </div>
                  <div className={`${fields.field} ${styles.phone}`}>
                    <PhoneField label="Телефон" name="phone" required {...errorProps("phone")} />
                    {fieldError("phone")}
                  </div>
                </div>
                <div className={fields.consentField}>
                  <label className={fields.consent}>
                    <input type="checkbox" name="consent" required {...errorProps("consent")} />
                    <span>Я даю согласие на обработку персональных данных и подтверждаю, что ознакомлен(а) с <a href={site.dataConsentHref} target="_blank" rel="noreferrer">Политикой обработки персональных данных</a></span>
                  </label>
                  {fieldError("consent")}
                </div>
                <label className={fields.consent}>
                  <input type="checkbox" name="marketing" />
                  <span>Даю согласие на получение информационных и маркетинговых рассылок</span>
                </label>
                {error && (
                  <p className={styles.error} id="quiz-form-error" role="alert">
                    {error === "unavailable" ? submissionError : "Пройдите квиз ещё раз."}
                  </p>
                )}
                <ActionButton arrow type="submit" disabled={pending}>{pending ? "Отправляем…" : "Получить презентацию"}</ActionButton>
              </form>
            </div>
          </div>
        </div>
      )}
      <RequestSuccess ref={success} onClose={reset} />
      <noscript><p className={styles.fallback}>Чтобы подобрать участок, позвоните по номеру <a href={site.phoneHref}>{site.phone}</a>.</p></noscript>
    </div>
  );
}
