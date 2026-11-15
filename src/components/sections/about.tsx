import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-16 border-y border-line bg-surface/30 py-24 md:py-36">
      <div className="wrap">
        <SectionHeading
          id="about-title"
          number="06"
          eyebrow="About"
          title="Where services, identity and infrastructure meet"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-[clamp(1.1875rem,1.6vw,1.375rem)] leading-[1.5] text-ink">
              {profile.about[0]}
            </p>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              {profile.about.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <p className="label mt-10 mb-3 text-faint">How I work</p>
            <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {profile.principles.map((pr, i) => (
                <li key={pr.title} className="bg-bg p-5">
                  <span className="label tabular-nums">0{i + 1}</span>
                  <p className="display mt-3 text-[1.125rem] leading-tight font-medium">{pr.title}</p>
                  <p className="mt-2 text-[0.9375rem] leading-snug text-muted">{pr.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <h3 className="label mb-3 text-faint">Education</h3>
            <ul className="border-t border-line">
              {profile.education.map((e, i) => (
                <li key={e.qualification} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-line py-5">
                  <p className={i === 0 ? "display text-[1.375rem] leading-tight font-medium" : "text-[1rem] font-medium"}>{e.qualification}</p>
                  <p className="font-mono text-[0.8125rem] text-ink tabular-nums">{e.result}</p>
                  <p className="text-[0.9375rem] text-muted">{e.institution}</p>
                  <p className="label text-faint">{e.period}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h3 className="label mb-3 text-faint">Outside the stack</h3>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {profile.beyond.map((b) => (
              <li key={b.title} className={"wide" in b && b.wide ? "bg-bg p-5 sm:col-span-2 md:p-6 lg:col-span-4" : "bg-bg p-5 md:p-6"}>
                <p className="display text-[1.125rem] leading-tight font-medium">{b.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-snug text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
