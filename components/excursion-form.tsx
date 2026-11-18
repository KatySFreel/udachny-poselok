"use client";

import { useRef } from "react";
import { RequestSuccess } from "./contact-dialog";
import { ContactForm } from "./contact-form";

export function ExcursionForm() {
  const success = useRef<HTMLDialogElement>(null);
  return (
    <>
      <ContactForm layout="inline" submitLabel="Записаться на экскурсию" onSuccess={() => success.current?.showModal()} />
      <RequestSuccess ref={success} />
    </>
  );
}
