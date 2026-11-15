import type { ReactNode } from "react";

import { Reveal } from "./reveal";

/**
 * Section opener: a quiet mono index line, one headline that says what the section shows,
 * and an optional note set to the right on wide screens.
 */
export function SectionHeading({
  number,
  eyebrow,
  title,
  note,
  id,
}: {
  number: string;
  eyebrow: string;
  title: ReactNode;
  note?: ReactNode;
  id: string;
}) {
  return (
    <Reveal className="mb-10 grid gap-5 md:mb-14 md:grid-cols-12 md:items-end md:gap-8">
      <div className="md:col-span-7">
        <p className="label mb-4 flex items-center gap-2">
          <span className="tabular-nums">{number}</span>
          <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
          <span className="text-muted">{eyebrow}</span>
        </p>
        <h2 id={id} className="display max-w-[22ch] text-[clamp(2rem,4vw,3rem)] leading-[1.08] tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      {note ? <p className="max-w-[34rem] text-[1rem] leading-relaxed text-muted md:col-span-5 md:justify-self-end">{note}</p> : null}
    </Reveal>
  );
}
