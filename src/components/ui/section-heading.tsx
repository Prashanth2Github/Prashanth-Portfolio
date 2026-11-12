import type { ReactNode } from "react";

import { Reveal } from "./reveal";

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
    <Reveal className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <p className="label mb-5 flex items-center gap-3">
          <span className="text-signal">{"// "}{number}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          {eyebrow}
        </p>
        <h2
          id={id}
          className="display text-[clamp(2.5rem,6.2vw,5.5rem)] leading-[0.95] font-semibold"
          style={{ fontVariationSettings: '"wdth" 92' }}
        >
          {title}
        </h2>
      </div>
      {note ? <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted md:col-span-4 md:justify-self-end">{note}</p> : null}
    </Reveal>
  );
}
