"use client";

import { useContext, useRef, useState, type FormEvent } from "react";
import type { LeadFormDefinition } from "../lib/lead-attribution";
import { useLeadTracking } from "./lead-tracking";
import { site } from "../content/site";
import { ActionButton } from "./action";
import { PersonalDataConsent } from "./personal-data-consent";
import { PhoneField, TextField } from "./form-field";
import { FormTest, simulateSubmission, submissionError } from "./form-simulation";
import { useContactValidation } from "./use-contact-validation";
import styles from "./contact-form.module.css";

export type FormChoiceField = {name:string;label:string;options:readonly string[]};

export function ContactForm({
  submitLabel,
  layout = "dialog",
  onSuccess,
  includeEmail = false,
  choiceField,
  definition,
}: {
  submitLabel: string;
  layout?: "dialog" | "inline";
  onSuccess?: () => void;
  includeEmail?: boolean;
  choiceField?: FormChoiceField;
  definition: LeadFormDefinition;
}) {
  const tracking = useLeadTracking(definition, submitLabel, true);
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
    const source = tracking.prepare(form, data);
    if (!validate(form, data)) {
      tracking.track("form_validation_error", source);
      setStatus("ready");
      return;
    }

    tracking.track("form_submit", source);
    setStatus("pending");
    const result = await simulateSubmission(outcome);
    if (formRef.current !== form) return;
    if (result === "error") {
      tracking.track("form_error", source);
      setStatus("error");
      return;
    }
    tracking.track("form_success", source);
    tracking.reset();
    setStatus("success");
    form.reset();
    onSuccess?.();
  }

  function edit(event: FormEvent<HTMLFormElement>) {
    clearField((event.target as HTMLInputElement).name);
    if (status === "error" || status === "success") setStatus("ready");
  }

  return (
    <form ref={formRef} method="post" className={styles.form} data-layout={layout} data-fields={includeEmail ? "name-email-phone" : undefined} data-lead-form-id={definition.id} noValidate onSubmit={submit} onInput={edit} onFocus={tracking.start}>
      <input type="hidden" name="attribution" />
      <fieldset disabled={pending} aria-busy={pending} className={styles.fields}>
        <div className={styles.inputs}>
          <div className={styles.field}>
            {fieldError("name")}
            <TextField label="Имя" name="name" autoComplete="name" placeholder="Введите ваше имя" maxLength={120} required {...errorProps("name")} />
          </div>
          {includeEmail && <div className={styles.field}>
            {fieldError("email")}
            <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="Введите ваш email" maxLength={254} required {...errorProps("email")} />
          </div>}
          <div className={styles.field}>
            {fieldError("phone")}
            <PhoneField label="Телефон" name="phone" required {...errorProps("phone")} />
          </div>
        </div>
        {choiceField && <fieldset className={styles.choices}>
          <legend>{choiceField.label}</legend>
          {choiceField.options.map((option,index) => <label key={option}>
            <input type="radio" name={choiceField.name} value={option} defaultChecked={index === 0} />
            <span>{option}</span>
          </label>)}
        </fieldset>}
        <div className={styles.consentField}>
          {fieldError("consent")}
          <PersonalDataConsent validation={errorProps("consent")} />
        </div>
      </fieldset>
      {status === "error" && <p className={styles.error} role="alert">{submissionError}</p>}
      <ActionButton type="submit" arrow disabled={pending}>{pending ? "Отправляем…" : submitLabel}</ActionButton>
      <noscript><p>Чтобы оставить заявку, позвоните <a href={site.phoneHref}>{site.phone}</a>.</p></noscript>
    </form>
  );
}
