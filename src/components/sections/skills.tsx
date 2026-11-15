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
          eyebrow="Skills"
          title="Every skill, linked to where I used it"
          note="Pick a category, then a technology, to see the workstream, project or certificate behind it."
        />
        <Reveal>
          <SkillsExplorer />
        </Reveal>
      </div>
    </section>
  );
}
