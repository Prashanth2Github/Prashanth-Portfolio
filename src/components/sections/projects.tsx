import { ArrowUpRight, GitHub } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectDiagram } from "@/components/viz/project-diagram";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <SectionHeading
        id="projects-title"
        number="03"
        eyebrow="Projects"
        title="Three projects, from LSTM prioritisation to an assistive glove"
        note="Each shows the problem, my contribution and the decisions behind it. The diagrams illustrate how each system fits together."
      />

      <div className="space-y-6 md:space-y-8">
        {projects.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={p.id} as="article">
              <div id={`project-${p.id}`} className="pane brackets grid scroll-mt-28 lg:grid-cols-12">
                <div className={cn("border-b border-line lg:col-span-6 lg:border-b-0", flip ? "lg:order-2 lg:border-l" : "lg:border-r")}>
                  <ProjectDiagram variant={p.diagram} />
                </div>
                <div className={cn("flex flex-col p-5 sm:p-7 lg:col-span-6 lg:p-10", flip && "lg:order-1")}>
                  <p className="label flex flex-wrap justify-between gap-2">
                    <span className="tabular-nums">{p.code}</span>
                    <span className="text-faint">{p.category}</span>
                  </p>
                  <h3 className="display mt-5 text-[clamp(1.75rem,3.2vw,2.625rem)] leading-[1.02] font-medium">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{p.summary}</p>

                  <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
                    <div className="bg-bg p-4">
                      <dt className="label mb-1.5 text-faint">Problem</dt>
                      <dd className="text-[0.9375rem] leading-snug text-ink">{p.problem}</dd>
                    </div>
                    <div className="bg-bg p-4">
                      <dt className="label mb-1.5 text-faint">My contribution</dt>
                      <dd className="text-[0.9375rem] leading-snug text-ink">{p.contribution}</dd>
                    </div>
                  </dl>

                  <p className="label mt-6 mb-2 text-faint">Engineering decisions</p>
                  <ol className="space-y-2">
                    {p.decisions.map((d, j) => (
                      <li key={d} className="grid grid-cols-[2rem_1fr] text-[0.9375rem] leading-relaxed text-muted">
                        <span className="label pt-[0.2em] tabular-nums">0{j + 1}</span>
                        {d}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>

                  {p.repo || p.demo ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {p.repo ? (
                        <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-sm">
                          <GitHub size={16} /> Source
                        </a>
                      ) : null}
                      {p.demo ? (
                        <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-sm">
                          Live demo <ArrowUpRight size={16} className="btn-arrow" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
