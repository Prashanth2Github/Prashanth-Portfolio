/**
 * Contact-form rules shared by the browser (instant feedback) and the API route (authoritative check).
 * Keep this file free of server-only code: it is bundled into the client.
 */

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  message: 5000,
} as const;

/** Submissions faster than this (ms since the form appeared) are treated as automated. */
export const MIN_FILL_MS = 3000;

export type ContactField = "name" | "email" | "message";
export type ContactInput = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Pragmatic address check: one @, no spaces or angle brackets, and a dotted domain with a 2+ letter TLD. */
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)*\.[A-Za-z]{2,}$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export function normalizeContact(raw: Partial<Record<ContactField, unknown>>): ContactInput {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    name: str(raw.name).replace(/\s+/g, " ").trim(),
    email: str(raw.email).trim(),
    message: str(raw.message).replace(/\r\n/g, "\n").trim(),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (!input.name) errors.name = "Please enter your name.";
  else if (input.name.length > CONTACT_LIMITS.name) errors.name = `Name must be ${CONTACT_LIMITS.name} characters or fewer.`;
  else if (CONTROL_CHARS.test(input.name)) errors.name = "Name contains characters that aren't allowed.";

  if (!input.email) errors.email = "Please enter your email address.";
  else if (input.email.length > CONTACT_LIMITS.email || !EMAIL_RE.test(input.email))
    errors.email = "Please enter a valid email address, like name@example.com.";

  if (!input.message) errors.message = "Please write a message.";
  else if (input.message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  else if (input.message.length > CONTACT_LIMITS.message)
    errors.message = `Message must be ${CONTACT_LIMITS.message.toLocaleString("en")} characters or fewer.`;

  return errors;
}
