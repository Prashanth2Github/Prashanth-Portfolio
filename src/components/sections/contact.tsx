import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/content/profile";

import { ContactActions } from "./contact-actions";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-16 overflow-hidden py-24 md:py-40">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0" style={{ maskImage: "radial-gradient(ellipse 70% 70% at 50% 60%, #000, transparent)" }} />
      <div className="wrap relative">
        <Reveal>
          <p className="label mb-6 flex items-center gap-3">
            <span className="text-signal">{"// "}07</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            Start a conversation
          </p>
          <h2 id="contact-title" className="display text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.92] font-semibold" style={{ fontVariationSettings: '"wdth" 100' }}>
            Have a system that
            <br />
            needs to hold up<span className="text-signal">?</span>
          </h2>
          <p className="mt-8 max-w-xl text-[1.125rem] leading-relaxed text-muted">
            Backend services, identity, workflows or infrastructure — I&apos;m happy to talk engineering. Email me directly, or send a message below.
          </p>
        </Reveal>

        <Reveal className="mt-12 border-t border-line pt-8" delay={0.1}>
          <a href={`mailto:${profile.email}`} className="display group inline-block text-[clamp(1.25rem,3.6vw,2.75rem)] leading-tight font-semibold break-all text-ink sm:break-normal">
            <span className="bg-[linear-gradient(var(--color-signal),var(--color-signal))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_2px]">
              {profile.email}
            </span>
          </a>
          <div className="mt-8">
            <ContactActions />
          </div>
          <p className="label mt-6 text-faint">{profile.location} · IST (UTC+5:30)</p>
        </Reveal>

        <Reveal className="mt-16 grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-16" delay={0.12}>
          <div className="lg:col-span-4">
            <p className="label mb-3 text-faint">{"// "}Message</p>
            <h3 id="contact-form-title" className="display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-semibold">
              Send a Message
            </h3>
            <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-muted">
              Prefer a form? Leave your name, email and message — it comes straight to my inbox and I&apos;ll reply by email.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
