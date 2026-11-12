import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

import { SkillsExplorer } from "./skills-explorer";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative scroll-mt-16 border-y border-line bg-surface/30 py-24 md:py-36">
      <div className="wrap">
        <SectionHeading
          id="skills-title"
          number="04"
          eyebrow="Tools in context"
          title={
            <>
              A connected
              <br />
              <span className="text-muted">toolkit.</span>
            </>
          }
          note="Pick a technology to see exactly where it was used — in my work, my projects or my certifications. No percentage bars."
        />
        <Reveal>
          <SkillsExplorer />
        </Reveal>
      </div>
    </section>
  );
}
