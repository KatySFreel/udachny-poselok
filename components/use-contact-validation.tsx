"use client";

import { useId, useState } from "react";
import { validateContact, type ContactErrors, type ContactField } from "../lib/contact-validation";
import styles from "./contact-form.module.css";

export function useContactValidation() {
  const id = useId();
  const [errors, setErrors] = useState<ContactErrors>({});

  function validate(form: HTMLFormElement, data: FormData) {
    const next = validateContact(data);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (!firstInvalid) return true;
    (form.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
    return false;
  }

  function clearField(name: string) {
    const field = name as ContactField;
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function errorProps(field: ContactField) {
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? id + "-" + field : undefined,
    };
  }

  function fieldError(field: ContactField) {
    const message = errors[field];
    return message && <p id={id + "-" + field} className={styles.fieldError} role="alert">{message}</p>;
  }

  return { validate, clearField, errorProps, fieldError };
}
