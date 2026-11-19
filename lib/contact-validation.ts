export type ContactField = "name" | "email" | "phone" | "consent";
export type ContactErrors = Partial<Record<ContactField, string>>;

export function validateContact(data: FormData): ContactErrors {
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const errors: ContactErrors = {};

  if (!name || name.length > 120) errors.name = "Укажите имя";
  if (data.has("email")) {
    const email = String(data.get("email") ?? "").trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Укажите email";
  }
  if (phone.length > 32 || !/^[+\d\s()–-]+$/.test(phone) || !/^(?:[78])?\d{10}$/.test(phone.replace(/\D/g, ""))) {
    errors.phone = "Укажите номер телефона";
  }
  if (data.get("consent") !== "on") errors.consent = "Подтвердите согласие";

  return errors;
}
