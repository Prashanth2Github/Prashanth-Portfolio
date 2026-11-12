import { ArrowUpRight } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { roles } from "@/content/experience";

import { WorkstreamList } from "./workstream-list";

export function Experience() {
  const [current, ...past] = roles;
  if (!current) return null;

  return (
    <section id="experience" aria-labelledby="experience-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <SectionHeading
        id="experience-title"
        number="01"
        eyebrow="The work"
        title={
          <>
            Experience,
            <br />
            <span className="text-muted">as engineering case files.</span>
          </>
        }
        note="Seven workstreams from my role at Karios AI — each opened up as problem, contribution, approach and how it was validated."
      />

      <Reveal as="article" className="pane brackets" >
        <header className="grid gap-6 border-b border-line p-5 md:grid-cols-12 md:items-end md:p-8">
          <div className="md:col-span-7">
            <p className="label mb-3 flex items-center gap-2.5">
              <span className="status-dot text-signal" data-live aria-hidden="true" />
              <span className="text-signal">Active</span>
              <span className="text-faint">·</span> {current.start} — {current.end}
            </p>
            <h3 className="display text-[clamp(2rem,4.2vw,3.5rem)] leading-none font-semibold" style={{ fontVariationSettings: '"wdth" 104' }}>
              {current.title}
              <span className="text-muted"> @ {current.company}</span>
            </h3>
          </div>
          <div className="md:col-span-5 md:justify-self-end md:text-right">
            <p className="max-w-md text-[1rem] leading-relaxed text-muted">{current.summary}</p>
            <p className="label mt-3 text-faint">{current.location}</p>
          </div>
        </header>
        <div className="px-5 md:px-8">
          <WorkstreamList items={current.workstreams} />
        </div>
        <p className="label px-5 py-4 text-faint md:px-8">
          Descriptions stay at the level of the work itself — no internal services, customers or architecture details.
        </p>
      </Reveal>

      {past.map((role) => (
        <Reveal key={role.id} as="article" className="mt-6 grid gap-6 border border-line p-5 md:grid-cols-12 md:p-8">
          <div className="md:col-span-4">
            <p className="label mb-2 text-faint">
              {role.start} — {role.end}
            </p>
            <h3 className="display text-[1.75rem] leading-tight font-semibold">{role.title}</h3>
            <p className="mt-1 text-muted">
              {role.company} · {role.location}
            </p>
          </div>
          <ul className="space-y-2.5 md:col-span-6">
            {role.highlights?.map((h) => (
              <li key={h} className="grid grid-cols-[0.75rem_1fr] gap-2 text-[0.9375rem] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 bg-line-strong" />
                {h}
              </li>
            ))}
          </ul>
          {role.evidence ? (
            <div className="md:col-span-2 md:justify-self-end">
              <a href={role.evidence.href} target="_blank" rel="noopener" className="label flex min-h-9 items-center gap-2 text-ink hover:text-signal">
                {role.evidence.label} <ArrowUpRight size={14} />
              </a>
            </div>
          ) : null}
        </Reveal>
      ))}
    </section>
  );
}
