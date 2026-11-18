"use client";

import { useEffect, useRef, type ComponentPropsWithRef } from "react";

function isBackdrop(dialog: HTMLDialogElement, target: EventTarget, x: number, y: number) {
  if (target !== dialog) return false;
  const { top, right, bottom, left } = dialog.getBoundingClientRect();
  return x < left || x >= right || y < top || y >= bottom;
}

export function AnimatedDialog(props: ComponentPropsWithRef<"dialog">) {
  const startedOnBackdrop = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function finishClose(dialog: HTMLDialogElement) {
    window.clearTimeout(closeTimer.current);
    dialog.close();
    delete dialog.dataset.closing;
  }

  function dismiss(dialog: HTMLDialogElement) {
    if (!dialog.open || dialog.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    dialog.dataset.closing = "true";
    // An immediate dismissal can happen before the first transition frame.
    closeTimer.current = window.setTimeout(() => finishClose(dialog), 280);
  }

  return (
    <dialog
      {...props}
      onPointerDown={(event) => {
        startedOnBackdrop.current = isBackdrop(event.currentTarget, event.target, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (startedOnBackdrop.current && isBackdrop(event.currentTarget, event.target, event.clientX, event.clientY)) {
          dismiss(event.currentTarget);
        }
        startedOnBackdrop.current = false;
      }}
      onCancel={(event) => {
        event.preventDefault();
        dismiss(event.currentTarget);
      }}
      onSubmitCapture={(event) => {
        if (event.currentTarget.dataset.closing) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onSubmit={(event) => {
        if (event.target instanceof HTMLFormElement && event.target.method === "dialog") {
          event.preventDefault();
          dismiss(event.currentTarget);
        }
      }}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && !event.pseudoElement
          && event.propertyName === "opacity" && event.currentTarget.dataset.closing) {
          finishClose(event.currentTarget);
        }
      }}
    />
  );
}
