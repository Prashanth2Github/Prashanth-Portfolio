import { profile } from "@/content/profile";

import { EventStream } from "./event-stream";
import { HeroActions } from "./hero-actions";
import { HeroName } from "./hero-name";
import { LocalTime } from "./local-time";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative pt-[var(--header-h)]">
      <div className="wrap grid items-center gap-12 pt-12 pb-20 md:pt-16 lg:min-h-[min(calc(100svh-var(--header-h)),48rem)] lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-muted">
            <span className="flex items-center gap-2 text-ink">
              <span className="state text-signal" aria-hidden="true" />
              {profile.currentTitle} at {profile.company}
            </span>
            <span className="label">
              {profile.location.split(",")[0]} · <LocalTime timeZone={profile.timezone} />
            </span>
          </p>

          <HeroName />

          <p className="mt-6 max-w-[36rem] text-[1.125rem] leading-[1.65] text-muted md:text-[1.1875rem]">
            {profile.intro}
          </p>

          <div className="mt-8 md:mt-10">
            <HeroActions />
          </div>
        </div>

        <div className="fade-up lg:col-span-6 lg:pl-4" style={{ "--d": "160ms" } as React.CSSProperties}>
          <EventStream />
        </div>
      </div>
    </section>
  );
}
