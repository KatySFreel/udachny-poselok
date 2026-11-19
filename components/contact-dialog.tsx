"use client";

import { sitePath } from "../lib/site-path";
import { useId, useRef, useState, type RefObject } from "react";
import { consultationId, consultationTitle } from "../content/home";
import { ActionButton } from "./action";
import { AnimatedDialog } from "./animated-dialog";
import { ContactForm } from "./contact-form";
import styles from "./contact-form.module.css";

export function DialogCloseButton() {
  return (
    <form method="dialog">
      <button className={styles.close} type="submit" aria-label="Закрыть" autoFocus>
        <img src={sitePath("/icons/quiz/close.svg")} alt="" width={15.5} height={15.5} />
      </button>
    </form>
  );
}

export function RequestSuccess({ ref, onClose }: { ref: RefObject<HTMLDialogElement | null>; onClose?: () => void }) {
  const title = useId();
  return (
    <AnimatedDialog
      ref={ref}
      data-contact-dialog
      className={`${styles.dialog} ${styles.success}`}
      aria-labelledby={title}
      onClose={onClose}
    >
      <DialogCloseButton />
      <div className={styles.intro}>
        <img src={sitePath("/icons/quiz/verified.svg")} alt="" width={28.927} height={31.8209} />
        <h2 id={title}>Спасибо!</h2>
        <p>Данные успешно отправлены.</p>
      </div>
      <form method="dialog"><ActionButton type="submit">Назад</ActionButton></form>
    </AnimatedDialog>
  );
}

export function ConsultationDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const success = useRef<HTMLDialogElement>(null);
  const [formVersion, reset] = useState(0);
  return (
    <>
      <AnimatedDialog data-contact-dialog id={consultationId} ref={dialog} className={styles.dialog} aria-labelledby="consultation-title" onClose={() => reset((version) => version + 1)}>
        <DialogCloseButton />
        <div className={styles.intro}>
          <h2 id="consultation-title">{consultationTitle}</h2>
          <p>Оставьте имя и телефон. Мы перезвоним и ответим на вопросы о покупке участка, готового дома или строительстве.</p>
        </div>
        <ContactForm key={formVersion} submitLabel="Оставить заявку" onSuccess={() => {
          if (!dialog.current?.open || dialog.current.dataset.closing) return;
          dialog.current.close();
          success.current?.showModal();
        }} />
      </AnimatedDialog>
      <RequestSuccess ref={success} />
    </>
  );
}
