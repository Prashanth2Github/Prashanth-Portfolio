import { profile } from "@/content/profile";

import { EventStream } from "./event-stream";
import { HeroActions } from "./hero-actions";
import { HeroBackdrop } from "./hero-backdrop";
import { HeroName } from "./hero-name";
import { LocalTime } from "./local-time";

const rail = [
  { k: "Role", v: `${profile.currentTitle} · ${profile.company}` },
  { k: "Core", v: "Go · REST · Temporal" },
  { k: "Identity", v: "LDAP · OIDC · SAML" },
];

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden pt-[var(--header-h)]">
      <HeroBackdrop />

      <div className="wrap relative flex min-h-[calc(100svh-var(--header-h))] flex-col pt-6 pb-10 md:pt-8">
        {/* Status rail */}
        <dl
          className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4"
        >
          {rail.map((item) => (
            <div key={item.k} className="bg-bg/90 px-4 py-3">
              <dt className="label text-faint">{item.k}</dt>
              <dd className="mt-0.5 font-mono text-[0.8125rem] text-ink">{item.v}</dd>
            </div>
          ))}
          <div className="bg-bg/90 px-4 py-3">
            <dt className="label flex items-center gap-2 text-faint">
              <span className="status-dot text-signal" data-live aria-hidden="true" /> Hyderabad
            </dt>
            <dd className="mt-0.5 font-mono text-[0.8125rem] text-ink">
              <LocalTime timeZone={profile.timezone} />
            </dd>
          </div>
        </dl>

        <div className="mt-[clamp(1.75rem,5vh,3.5rem)]">
          <p className="label fade-up mb-6 flex items-center gap-3" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span className="text-signal">{"// "}{profile.role}</span>
            <span aria-hidden="true" className="hidden h-px w-10 bg-line-strong sm:block" />
            <span className="hidden sm:inline">Control plane · v2</span>
          </p>
          <HeroName />
        </div>

        <div className="mt-[clamp(2rem,4.5vh,3.5rem)] grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 xl:col-span-6">
            <p
              className="display fade-up max-w-[30ch] text-[clamp(1.5rem,2.3vw,2.125rem)] leading-[1.15] font-medium"
              style={{ "--d": "520ms", fontVariationSettings: '"wdth" 96' } as React.CSSProperties}
            >
              {profile.headline}
            </p>
            <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted">
              {profile.intro}
            </p>
            <div className="mt-8">
              <HeroActions />
            </div>
          </div>
          <div className="fade-up lg:col-span-6 xl:col-span-5 xl:col-start-8" style={{ "--d": "760ms" } as React.CSSProperties}>
            <EventStream />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-12">
          <a href="#experience" className="label group flex items-center gap-3 text-faint hover:text-ink">
            <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-line-strong" aria-hidden="true" />
            Scroll to explore
          </a>
          <p className="label hidden text-faint sm:block">{profile.focus.join("  ·  ")}</p>
        </div>
      </div>
    </section>
  );
}
