"use client";

import { useRef } from "react";
import { RequestSuccess } from "./contact-dialog";
import { ContactForm } from "./contact-form";

export function ExcursionForm({ successDisplay }: { successDisplay: "inline" | "dialog" }) {
  const success = useRef<HTMLDialogElement>(null);
  const showDialog = successDisplay === "dialog";

  return (
    <>
      <ContactForm
        layout="inline"
        submitLabel="Записаться на экскурсию"
        onSuccess={showDialog ? () => success.current?.showModal() : undefined}
        successMessage={showDialog ? undefined : "Заявка заполнена. Для записи позвоните нам."}
      />
      {showDialog && <RequestSuccess ref={success} />}
    </>
  );
}
