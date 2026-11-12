"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";

import { ArrowRight, Plus } from "@/components/ui/icons";
import type { Workstream } from "@/content/types";
import { cn, scrollToId } from "@/lib/utils";

const columns = [
  { key: "problem", label: "Problem" },
  { key: "contribution", label: "Engineering contribution" },
  { key: "approach", label: "Technical approach" },
  { key: "validation", label: "Validation" },
] as const;

export function WorkstreamList({ items }: { items: Workstream[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([items[0]?.id ?? ""]));

  // Deep links (e.g. from the systems map or skills) open and reveal a workstream.
  useEffect(() => {
    const sync = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!items.some((w) => w.id === id)) return;
      setOpen((prev) => new Set(prev).add(id));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ol className="border-b border-line">
      {items.map((ws) => {
        const isOpen = open.has(ws.id);
        return (
          <li key={ws.id} id={ws.id} className="group/ws scroll-mt-28 border-t border-line">
            <h4>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${ws.id}-panel`}
                onClick={() => toggle(ws.id)}
                className="grid w-full grid-cols-[3.75rem_1fr_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-surface/60 sm:grid-cols-[5rem_1fr_auto] md:py-6 lg:grid-cols-[6rem_minmax(0,1fr)_minmax(0,0.9fr)_auto]"
              >
                <span className={cn("label pl-1 transition-colors", isOpen ? "text-signal" : "text-faint group-hover/ws:text-signal")}>{ws.code}</span>
                <span className="display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight font-semibold">{ws.title}</span>
                <span className="hidden flex-wrap gap-1.5 lg:flex" aria-hidden="true">
                  {ws.tech.slice(0, 4).map((t) => (
                    <span key={t} className="chip text-muted">
                      {t}
                    </span>
                  ))}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mr-1 flex size-9 items-center justify-center border transition-all duration-300",
                    isOpen ? "rotate-45 border-signal bg-signal text-bg" : "border-line text-ink group-hover/ws:border-line-strong",
                  )}
                >
                  <Plus size={16} />
                </span>
              </button>
            </h4>
            <m.div
              id={`${ws.id}-panel`}
              role="region"
              aria-label={ws.title}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              inert={!isOpen}
            >
              <div className="grid gap-px bg-line pb-px md:grid-cols-2 xl:grid-cols-4">
                {columns.map((col, i) => (
                  <div key={col.key} className="bg-bg p-5 md:p-6">
                    <p className="label mb-3 flex items-center gap-2">
                      <span className="text-signal">0{i + 1}</span> {col.label}
                    </p>
                    {col.key === "approach" ? (
                      <ul className="space-y-2.5">
                        {ws.approach.map((a) => (
                          <li key={a} className="grid grid-cols-[0.75rem_1fr] gap-2 text-[0.9375rem] leading-relaxed text-muted">
                            <span aria-hidden="true" className="mt-[0.6em] size-1.5 bg-signal" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn("text-[0.9375rem] leading-relaxed", col.key === "problem" ? "text-ink" : "text-muted")}>{ws[col.key]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 py-4">
                {ws.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
                {ws.simulation ? (
                  <a
                    href={`#${ws.simulation.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(ws.simulation!.id);
                    }}
                    className="label ml-auto flex min-h-9 items-center gap-2 px-1 text-signal hover:text-ink"
                  >
                    Explore it: {ws.simulation.label} <ArrowRight size={14} />
                  </a>
                ) : null}
              </div>
            </m.div>
          </li>
        );
      })}
    </ol>
  );
}
