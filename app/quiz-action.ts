"use server";

import { quizQuestions } from "../content/quiz";
import { validateContact } from "../lib/contact-validation";

export async function submitQuiz(form: FormData, answers: Record<string, string[]>, simulate = false) {
  const name = String(form.get("name") ?? "").trim();
  const phone = String(form.get("phone") ?? "").replace(/\D/g, "");
  if (Object.keys(validateContact(form)).length) return "invalid";

  const selections = quizQuestions.map(({ id, title, multiple, options }) => {
    const answer = answers?.[id];
    if (!Array.isArray(answer) || !answer.length || answer.length > (multiple ? options.length : 1)
      || !answer.every((option) => typeof option === "string" && options.includes(option))) return null;

    return { id, question: title, answers: [...new Set(answer)] };
  });
  if (selections.includes(null)) return "answers";

  const endpoint = process.env.QUIZ_WEBHOOK_URL;
  if (simulate || !endpoint) return "simulation";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: String(form.get("email") ?? "").trim(),
        phone: `+7${phone.slice(-10)}`,
        consent: true,
        marketingConsent: form.get("marketing") === "on",
        selections,
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? "ok" : "unavailable";
  } catch {
    return "unavailable";
  }
}
