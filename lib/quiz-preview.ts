import type { submitQuiz as submitServerQuiz } from "../app/quiz-action";
import { validateContact } from "./contact-validation";

// GitHub Pages serves this preview without a Next.js server.
export const submitQuiz: typeof submitServerQuiz = async (form) => {
  if (Object.keys(validateContact(form)).length) return "invalid";
  return "simulation";
};
