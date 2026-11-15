import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/content/profile";

import { ContactActions } from "./contact-actions";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="label mb-4 flex items-center gap-2">
            <span className="tabular-nums">07</span>
            <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
            <span className="text-muted">Contact</span>
          </p>
          <h2 id="contact-title" className="display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.08] tracking-[-0.03em]">
            Get in touch about backend, identity or infrastructure work
          </h2>
          <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted">
            Email is the quickest way to reach me. The form goes to the same inbox, and I reply by email.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="display link mt-10 inline-block text-[clamp(1.125rem,1.9vw,1.5rem)] leading-tight break-all text-ink sm:break-normal"
          >
            {profile.email}
          </a>
          <div className="mt-6">
            <ContactActions />
          </div>
          <p className="label mt-6 flex items-center gap-2">
            <span className="state text-signal" aria-hidden="true" />
            {profile.location} · IST, UTC+5:30
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <div className="pane p-6 md:p-8">
            <h3 id="contact-form-title" className="display text-[1.5rem] leading-tight tracking-[-0.02em]">
              Send a Message
            </h3>
            <p className="mt-2 mb-8 text-[0.9375rem] leading-relaxed text-muted">
              Your name, email and message come straight to my inbox.
            </p>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
