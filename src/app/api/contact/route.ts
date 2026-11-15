import { NextResponse } from "next/server";

import { profile } from "@/content/profile";
import { MIN_FILL_MS, normalizeContact, validateContact } from "@/lib/contact";

/**
 * POST /api/contact — sends a contact-form message by email through Resend (https://resend.com).
 *
 * Server-only configuration (set in .env.local locally, or in your host's environment settings):
 *   RESEND_API_KEY      required — without it the route answers 503 and nothing is "sent".
 *   CONTACT_TO_EMAIL    optional — inbox that receives messages. Defaults to profile.email.
 *   CONTACT_FROM_EMAIL  optional — sender. Defaults to Resend's test sender, which can only deliver
 *                       to the email address that owns the Resend account.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_SENDS = 5;

/** Best-effort, per-instance limiter on actual sends. Serverless hosts may run several instances. */
const sends = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (sends.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_SENDS) {
    sends.set(key, recent);
    return true;
  }
  recent.push(now);
  sends.set(key, recent);
  if (sends.size > 5000) sends.clear();
  return false;
}

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const direct = `email ${profile.email} directly.`;

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: "That message is too long to send." });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(400, { error: "The request was malformed. Please try again." });
  }

  // Spam: hidden honeypot field that people never see or fill in.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply(400, { error: `Your message could not be sent. Please ${direct}` });
  }
  // Spam: forms submitted faster than a person could type.
  const elapsed = typeof body.elapsed === "number" && Number.isFinite(body.elapsed) ? body.elapsed : 0;
  if (elapsed < MIN_FILL_MS) {
    return reply(400, { error: "That was quicker than expected — please wait a moment and send again." });
  }

  const input = normalizeContact(body);
  const fields = validateContact(input);
  if (Object.keys(fields).length > 0) {
    return reply(422, { error: "Please fix the highlighted fields.", fields });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — message not sent.");
    return reply(503, { error: `The contact form isn't connected to email yet. Please ${direct}` });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return reply(429, { error: `Too many messages in a short time. Please try again later, or ${direct}` });
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio Contact <onboarding@resend.dev>";
  const subject = `Portfolio message from ${input.name}`.slice(0, 150);
  const received = new Date().toUTCString();

  const text = [`Name: ${input.name}`, `Email: ${input.email}`, `Received: ${received}`, "", "Message:", input.message].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
<p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
<p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
<p style="margin:0 0 16px;color:#666"><strong>Received:</strong> ${escapeHtml(received)}</p>
<p style="margin:0 0 4px"><strong>Message:</strong></p>
<div style="white-space:pre-wrap;border-left:3px solid #b6f23a;padding-left:12px">${escapeHtml(input.message)}</div>
</div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: input.email, subject, text, html }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[contact] Resend rejected the message (${res.status}): ${detail.slice(0, 500)}`);
      return reply(502, { error: `Your message couldn't be delivered right now. Please try again, or ${direct}` });
    }
    return reply(200, { ok: true });
  } catch (error) {
    console.error("[contact] Could not reach Resend:", error);
    return reply(502, { error: `Your message couldn't be delivered right now. Please try again, or ${direct}` });
  }
}
