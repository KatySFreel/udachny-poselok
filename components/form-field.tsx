"use client";

import type { ComponentPropsWithoutRef, FormEvent, KeyboardEvent } from "react";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & { label: string };

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function countDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // A bare ten-digit number may itself start with 7 or 8.
  const hasPrefix = /^\s*(?:\+7|[78](?=[\s(]|$))/.test(value) || /^[78]\d{10,}$/.test(digits);
  const local = hasPrefix ? digits.slice(1) : digits;
  const area = local.slice(0, 3);
  const exchange = local.slice(3, 6);
  const firstPair = local.slice(6, 8);
  const lastPair = local.slice(8, 10);

  let formatted = "+7";
  if (area) formatted += " (" + area;
  if (exchange) formatted += ") " + exchange;
  if (firstPair) formatted += "–" + firstPair;
  if (lastPair) formatted += "–" + lastPair;
  return formatted;
}

function formatInput(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const value = input.value;
  const caret = input.selectionStart ?? value.length;
  const formatted = formatPhone(value);
  if (formatted === value) return;
  input.value = formatted;
  if (caret === value.length) return;

  // Keep the caret alongside the same digit when editing within the number.
  const remaining = countDigits(value.slice(caret));
  let position = formatted.length;
  let digits = 0;
  while (position > 0 && digits < remaining) {
    if (/\d/.test(formatted[--position])) digits++;
  }
  input.setSelectionRange(position, position);
}

function deleteThroughSeparator(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key !== "Backspace" && event.key !== "Delete") return;
  const input = event.currentTarget;
  const { selectionStart: start, selectionEnd: end, value } = input;
  if (start === null || start !== end || !value) return;

  if (event.key === "Backspace") {
    if (start <= 2) {
      event.preventDefault();
      if (value === "+7") input.setRangeText("", 0, 2, "end");
      return;
    }
    let position = start;
    while (position > 2 && /\D/.test(value[position - 1])) position--;
    if (position !== start) input.setSelectionRange(position, position);
  } else {
    let position = Math.max(2, start);
    while (position < value.length && /\D/.test(value[position])) position++;
    if (position !== start) input.setSelectionRange(position, position);
  }
}

export function PhoneField(props: TextFieldProps) {
  return (
    <TextField
      placeholder="+7 (000) 000–00–00"
      autoComplete="tel"
      {...props}
      type="tel"
      inputMode="tel"
      onInput={formatInput}
      onKeyDown={deleteThroughSeparator}
    />
  );
}
