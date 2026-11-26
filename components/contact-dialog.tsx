"use client";

import { sitePath } from "../lib/site-path";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { leadForms, type LeadFormDefinition } from "../lib/lead-attribution";
import { useLeadTracking } from "./lead-tracking";
import { consultationId, consultationTitle } from "../content/home";
import { ActionButton } from "./action";
import { AnimatedDialog } from "./animated-dialog";
import { ContactForm, type FormChoiceField } from "./contact-form";
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

export function RequestDialog({id,title,description,definition,submitLabel = "Оставить заявку"}: {
  id: string;
  title: string;
  description: string;
  definition: LeadFormDefinition;
  submitLabel?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const success = useRef<HTMLDialogElement>(null);
  const [formVersion, reset] = useState(0);
  const tracking = useLeadTracking(definition, submitLabel, true);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    // Observe native command buttons and programmatic openings alike, including
    // browsers that do not emit a dialog toggle event.
    const observer = new MutationObserver(() => { if (element.open) tracking.open(); });
    observer.observe(element, {attributes:true, attributeFilter:['open']});
    return () => observer.disconnect();
  }, [tracking.open]);
  return <>
    <AnimatedDialog data-contact-dialog id={id} ref={dialog} className={styles.dialog} aria-labelledby={titleId}
      onClose={() => reset(version => version + 1)}>
      <DialogCloseButton />
      <div className={styles.intro}><h2 id={titleId}>{title}</h2><p>{description}</p></div>
      <ContactForm key={formVersion} definition={definition} submitLabel={submitLabel} onSuccess={() => {
        if (!dialog.current?.open || dialog.current.dataset.closing) return;
        dialog.current.close();
        success.current?.showModal();
      }} />
    </AnimatedDialog>
    <RequestSuccess ref={success} />
  </>;
}

export function ConsultationDialog() {
  return <RequestDialog id={consultationId} definition={leadForms.consultation} title={consultationTitle}
    description="Оставьте имя и телефон. Мы перезвоним и ответим на вопросы о покупке участка, готового дома или строительстве." />;
}

export function InlineRequestForm({definition,submitLabel,includeEmail = false,choiceField}: {
  definition: LeadFormDefinition;
  submitLabel: string;
  includeEmail?: boolean;
  choiceField?: FormChoiceField;
}) {
  const success = useRef<HTMLDialogElement>(null);
  return <>
    <ContactForm definition={definition} layout="inline" submitLabel={submitLabel} includeEmail={includeEmail} choiceField={choiceField} onSuccess={() => success.current?.showModal()} />
    <RequestSuccess ref={success} />
  </>;
}
