"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { ArrowRight, Check } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import {
  CONTACT_LIMITS,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: ContactInput = { name: "", email: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "message"];

const fieldClass =
  "w-full rounded-[2px] border border-line-strong bg-bg/70 px-4 py-3 text-[1rem] leading-normal text-ink transition-colors duration-200 placeholder:text-faint hover:border-muted focus:border-signal aria-[invalid=true]:border-fail disabled:opacity-60";

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [attempted, setAttempted] = useState(false);

  const inFlight = useRef(false);
  const shownAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const update = (field: ContactField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateContact(normalizeContact(next)));
    if (status === "error") setStatus("idle");
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return; // never send twice while a request is open

    setAttempted(true);
    const input = normalizeContact(values);
    const found = validateContact(input);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    inFlight.current = true;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website, elapsed: Date.now() - shownAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ContactErrors };

      if (res.ok && data.ok) {
        setSentTo(input.email);
        setValues(EMPTY);
        setErrors({});
        setAttempted(false);
        setStatus("sent");
        return;
      }
      if (data.fields) setErrors(data.fields);
      setServerError(data.error ?? `Something went wrong and your message wasn't sent. Please email ${profile.email} directly.`);
      setStatus("error");
    } catch {
      setServerError(`Couldn't reach the server — check your connection and try again, or email ${profile.email} directly.`);
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  const sending = status === "sending";

  if (status === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-line bg-bg/70 p-6 outline-none md:p-8">
        <p className="label flex items-center gap-2 text-signal">
          <Check size={14} /> Message delivered
        </p>
        <p className="display mt-3 text-[1.5rem] leading-tight font-semibold">Thanks — your message is on its way.</p>
        <p className="mt-2 text-[1rem] leading-relaxed text-muted">
          I&apos;ll reply to <span className="text-ink">{sentTo}</span> as soon as I can.
        </p>
        <button
          type="button"
          className="btn btn-sm mt-6"
          onClick={() => {
            shownAt.current = Date.now();
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const describe = (field: ContactField, extra?: string) =>
    [errors[field] ? `contact-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={sending} aria-labelledby="contact-form-title" className="relative">
      <fieldset disabled={sending} className="grid gap-5">
        <legend className="sr-only">Send a message</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contact-name" label="Name" error={errors.name}>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              maxLength={CONTACT_LIMITS.name}
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describe("name")}
              className={fieldClass}
            />
          </Field>
          <Field id="contact-email" label="Email" error={errors.email}>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your email"
              required
              maxLength={CONTACT_LIMITS.email}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field
          id="contact-message"
          label="Message"
          error={errors.message}
          aside={
            <span id="contact-message-count" className={cn("label", values.message.length > CONTACT_LIMITS.message ? "text-fail" : "text-faint")}>
              {values.message.length.toLocaleString("en")} / {CONTACT_LIMITS.message.toLocaleString("en")}
            </span>
          }
        >
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your message"
            required
            rows={6}
            minLength={CONTACT_LIMITS.messageMin}
            maxLength={CONTACT_LIMITS.message}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message", "contact-message-count")}
            className={cn(fieldClass, "min-h-[9rem] resize-y")}
          />
        </Field>

        {/* Honeypot: hidden from people and assistive tech; bots that fill it are rejected server-side. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? (
              <>
                <span aria-hidden="true" className="inline-block size-2 rounded-full bg-current" style={{ animation: "pulse-dot 1s ease-in-out infinite" }} />
                Sending…
              </>
            ) : (
              <>
                Send Message <ArrowRight size={14} />
              </>
            )}
          </button>
          <p className="label text-faint">Goes straight to my inbox</p>
        </div>

        <p role="alert" aria-live="assertive" className={cn("text-[0.9375rem] leading-snug text-fail", !serverError && "sr-only")}>
          {status === "error" ? serverError : ""}
        </p>
      </fieldset>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label text-muted">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[0.875rem] leading-snug text-fail">
          {error}
        </p>
      ) : null}
    </div>
  );
}
