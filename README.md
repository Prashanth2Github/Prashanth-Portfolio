# Control Plane — Prashanth Bonkuru

The engineering portfolio of **Prashanth Bonkuru, Software Engineer**. One statically generated page, designed like an operations console: an editorial grid in graphite and lime, interactive system simulations, a ⌘K command palette and a Human / API view toggle.

## Run it

Requires Node.js 20+.

```sh
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (fully static)
npm start            # serve the production build
```

Quality checks:

```sh
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build && npm run test:e2e   # Playwright end-to-end suite (desktop + mobile), uses local Chrome
```

## Edit the content

All facts live in typed modules under `src/content/` — presentation code never hardcodes them.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, headline, intro, about, education, activities, links (`github` is `null` until you add one) |
| `experience.ts` | Roles and the seven Karios workstreams (problem → contribution → approach → validation) |
| `projects.ts` | Projects; add `repo` / `demo` URLs and buttons appear automatically |
| `skills.ts` | Skill categories, each skill linked to the evidence where it was used |
| `credentials.ts` | Certifications (images and PDFs live in `public/certificates/`) |
| `systems.ts` | Data for the conceptual simulations |
| `site.ts` | Section order, SEO title/description, site URL |

The résumé served for download is `public/resume/Prashanth_Bonkuru_Resume.pdf`. Replace that file to update it.

## Deploy

Every page is prerendered; the only server code is the contact-form endpoint `POST /api/contact`. Deploy to Vercel (zero config) or any Node host via `npm start`. A purely static host (e.g. GitHub Pages) would serve the site, but the contact form would not work. Set the public URL so canonical links, the sitemap, Open Graph tags and JSON-LD point at the real domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Contact form (email via Resend)

The "Send a Message" form posts to `src/app/api/contact/route.ts`, which validates the input again on the server, applies basic spam checks (hidden honeypot field, minimum fill time, per-IP send limit) and sends the message through the [Resend](https://resend.com) REST API. The API key never reaches the browser. Without a key the endpoint answers `503` and the form tells the visitor to email directly — it never pretends a message was sent.

1. Create a free Resend account — **sign up with `bonkuruprashanth05@gmail.com`** so the test sender can deliver to you.
2. Create an API key at <https://resend.com/api-keys> (permission: "Sending access").
3. Copy `.env.example` to `.env.local` and set `RESEND_API_KEY=re_...`. On Vercel, add the same variables under Project → Settings → Environment Variables, then redeploy.
4. Restart `npm run dev`, submit the form, and check your inbox (and spam folder). Delivery errors are logged in the server console as `[contact] ...`.

| Variable | Required | Default |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | — |
| `CONTACT_TO_EMAIL` | no | `profile.email` (bonkuruprashanth05@gmail.com) |
| `CONTACT_FROM_EMAIL` | no | `Portfolio Contact <onboarding@resend.dev>` — Resend's test sender, which can only deliver to the address that owns the Resend account. To send from your own address, verify a domain in Resend and set e.g. `Portfolio Contact <contact@your-domain.com>`. |

Replies: each email sets `Reply-To` to the visitor's address, so you can answer straight from your inbox.

## Structure

```
src/
  app/            layout (fonts, metadata, JSON-LD), page, OG image, sitemap, robots, /v1/engineer/prashanth JSON route
  components/
    layout/       header + nav pill, command palette (lazy), Human/API view shell, API view, footer
    hero/         hero, variable-width name, simulated event stream, spotlight grid backdrop
    sections/     experience, systems, projects, skills, credentials, about, contact
    viz/          systems map, VM migration workflow, auth flow, config resolution, project diagrams
    ui/           icons, section heading, reveal, magnetic
  content/        typed source-of-truth data
  lib/            hooks, utils, evidence resolver, API payload builder, deferred Motion features
tests/            Playwright end-to-end suite
```

**Stack:** Next.js 15 (App Router, static), React 19, TypeScript, Tailwind CSS v4, Motion, cmdk. Fonts: Archivo (variable width), Geist, JetBrains Mono via `next/font`.

## Accuracy notes

- Content is sourced from the résumé and certificate PDFs. Current sources: `Prashanth_Resume3.pdf` and `Prashanth_Certifications.pdf`.
- The simulations are conceptual models built from standard concepts. They contain no employer-internal services, endpoints, customers or architecture.
- The hero event stream is labelled on-screen as a simulation.
