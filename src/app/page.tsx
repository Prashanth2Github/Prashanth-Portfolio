import { Hero } from "@/components/hero/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { ViewShell } from "@/components/layout/view-shell";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Credentials } from "@/components/sections/credentials";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Systems } from "@/components/sections/systems";

export default function HomePage() {
  return (
    <main id="main">
      <ViewShell>
        <Hero />
        <Experience />
        <Systems />
        <Projects />
        <Skills />
        <Credentials />
        <About />
        <Contact />
        <SiteFooter />
      </ViewShell>
    </main>
  );
}
