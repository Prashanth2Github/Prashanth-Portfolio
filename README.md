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

Every route is prerendered, so it deploys to Vercel with zero config (or to any Node host via `npm start`). Set the public URL so canonical links, the sitemap, Open Graph tags and JSON-LD point at the real domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

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

- Content is sourced from the résumé and certificate PDFs. k6 and CI/CD come from Prashanth's own brief and are not yet on the résumé (marked `source: "brief"` in `experience.ts`).
- The simulations are conceptual models built from standard concepts. They contain no employer-internal services, endpoints, customers or architecture.
- The hero event stream is labelled on-screen as a simulation.
