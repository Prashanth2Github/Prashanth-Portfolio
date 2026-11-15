import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { AuthFlow } from "@/components/viz/auth-flow";
import { ConfigResolution } from "@/components/viz/config-resolution";
import { MigrationWorkflow } from "@/components/viz/migration-workflow";
import { SystemsMap } from "@/components/viz/systems-map";

export function Systems() {
  return (
    <section id="systems" aria-labelledby="systems-title" className="relative scroll-mt-16 border-y border-line bg-surface/30 py-24 md:py-36">
      <div className="wrap">
        <SectionHeading
          id="systems-title"
          number="02"
          eyebrow="Systems"
          title="Interactive models of the systems I work on"
          note="Conceptual models built from standard concepts, not from any employer’s internal design. Run a migration, force a failure, switch identity providers."
        />

        <Reveal>
          <SystemsMap />
        </Reveal>

        <div className="mt-6">
          <Reveal>
            <MigrationWorkflow />
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Reveal className="flex">
            <AuthFlow />
          </Reveal>
          <Reveal className="flex" delay={0.08}>
            <ConfigResolution />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
