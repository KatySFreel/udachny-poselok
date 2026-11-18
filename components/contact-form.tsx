"use client";

import { useContext, useRef, useState, type FormEvent } from "react";
import { site } from "../content/site";
import { ActionButton } from "./action";
import { PhoneField, TextField } from "./form-field";
import { FormTest, simulateSubmission, submissionError } from "./form-simulation";
import { useContactValidation } from "./use-contact-validation";
import styles from "./contact-form.module.css";

export function ContactForm({
  submitLabel,
  layout = "dialog",
  onSuccess,
  successMessage,
}: {
  submitLabel: string;
  layout?: "dialog" | "inline";
  onSuccess?: () => void;
  successMessage?: string;
}) {
  const { outcome } = useContext(FormTest);
  const { validate, clearField, errorProps, fieldError } = useContactValidation();
  const [status, setStatus] = useState<"ready" | "pending" | "error" | "success">("ready");
  const formRef = useRef<HTMLFormElement>(null);
  const pending = status === "pending";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!validate(form, data)) {
      setStatus("ready");
      return;
    }

    setStatus("pending");
    const result = await simulateSubmission(outcome);
    if (formRef.current !== form) return;
    if (result === "error") {
      setStatus("error");
      return;
    }
    setStatus("success");
    form.reset();
    onSuccess?.();
  }

  function edit(event: FormEvent<HTMLFormElement>) {
    clearField((event.target as HTMLInputElement).name);
    if (status === "error" || status === "success") setStatus("ready");
  }

  return (
    <form ref={formRef} method="post" className={styles.form} data-layout={layout} noValidate onSubmit={submit} onInput={edit}>
      <fieldset disabled={pending} aria-busy={pending} className={styles.fields}>
        <div className={styles.inputs}>
          <div className={styles.field}>
            {fieldError("name")}
            <TextField label="Имя" name="name" autoComplete="name" placeholder="Введите ваше имя" maxLength={120} required {...errorProps("name")} />
          </div>
          <div className={`${styles.field} ${styles.phone}`}>
            {fieldError("phone")}
            <PhoneField label="Телефон" name="phone" required {...errorProps("phone")} />
          </div>
        </div>
        <div className={styles.consentField}>
          {fieldError("consent")}
          <label className={styles.consent}>
            <input type="checkbox" name="consent" required {...errorProps("consent")} />
            <span>Я даю согласие на обработку персональных данных и подтверждаю, что ознакомлен(а) с <a href={site.dataConsentHref} target="_blank" rel="noreferrer">Политикой обработки персональных данных</a></span>
          </label>
        </div>
      </fieldset>
      {status === "error" && <p className={styles.error} role="alert">{submissionError}</p>}
      <ActionButton type="submit" arrow disabled={pending}>{pending ? "Отправляем…" : submitLabel}</ActionButton>
      {status === "success" && successMessage && <p className={styles.successMessage} role="status">{successMessage}</p>}
      <noscript><p>Чтобы оставить заявку, позвоните <a href={site.phoneHref}>{site.phone}</a>.</p></noscript>
    </form>
  );
}
