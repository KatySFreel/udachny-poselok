export type ContactField = "name" | "phone" | "consent";
export type ContactErrors = Partial<Record<ContactField, string>>;

export function validateContact(data: FormData): ContactErrors {
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const errors: ContactErrors = {};

  if (!name || name.length > 120) errors.name = "Укажите имя";
  if (phone.length > 32 || !/^[+\d\s()–-]+$/.test(phone) || !/^(?:[78])?\d{10}$/.test(phone.replace(/\D/g, ""))) {
    errors.phone = "Укажите номер телефона";
  }
  if (data.get("consent") !== "on") errors.consent = "Подтвердите согласие";

  return errors;
}
