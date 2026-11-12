"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { ArrowRight } from "@/components/ui/icons";
import { allWorkstreams } from "@/content/experience";
import { mapEdges, mapNodes, type MapNodeId } from "@/content/systems";
import { useOnScreen } from "@/lib/hooks";
import { cn, scrollToId } from "@/lib/utils";

const byId = Object.fromEntries(mapNodes.map((n) => [n.id, n])) as Record<MapNodeId, (typeof mapNodes)[number]>;

export function SystemsMap() {
  const [active, setActive] = useState<MapNodeId>("api");
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const reduce = useReducedMotion();
  const node = byId[active];
  const connected = new Set(mapEdges.filter((e) => e.from === active || e.to === active).flatMap((e) => [e.from, e.to]));

  return (
    <div ref={ref} className="pane brackets grid lg:grid-cols-12" data-active="true">
      <div className="grid-lines relative border-b border-line lg:col-span-8 lg:border-r lg:border-b-0">
        <div className="pane-head">
          <p className="label">
            <span className="text-signal">SYS-00</span> · Engineering systems map
          </p>
          <p className="label hidden text-faint sm:block">Hover or tap a component</p>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-[46rem]">
          <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {mapEdges.map((e) => {
              const a = byId[e.from];
              const b = byId[e.to];
              const isActive = e.from === active || e.to === active;
              const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke={isActive ? "var(--color-signal)" : "var(--color-line-strong)"}
                    strokeWidth={isActive ? 0.35 : 0.22}
                    strokeDasharray={isActive ? "none" : "0.8 0.9"}
                    style={{ transition: "stroke 300ms ease, stroke-width 300ms ease" }}
                  />
                  {isActive ? (
                    <text
                      x={(a.x + b.x) / 2}
                      y={(a.y + b.y) / 2 - 1.2}
                      textAnchor="middle"
                      className="hidden fill-muted font-mono sm:block"
                      style={{ fontSize: 1.9, letterSpacing: "0.05em" }}
                    >
                      {e.label.toUpperCase()}
                    </text>
                  ) : null}
                  {isActive && onScreen && !reduce ? (
                    <>
                      <circle r="0.75" fill="var(--color-signal)">
                        <animateMotion dur="2.4s" repeatCount="indefinite" path={e.from === active ? d : `M ${b.x} ${b.y} L ${a.x} ${a.y}`} />
                      </circle>
                      <circle r="0.55" fill="var(--color-info)">
                        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path={e.from === active ? `M ${b.x} ${b.y} L ${a.x} ${a.y}` : d} />
                      </circle>
                    </>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {mapNodes.map((n) => {
            const isActive = n.id === active;
            const isLinked = connected.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActive(n.id)}
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                aria-pressed={isActive}
                title={n.title}
                className={cn(
                  "absolute flex min-h-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2 border px-3 font-mono text-[0.75rem] tracking-[0.06em] uppercase transition-all duration-300 sm:min-h-11 sm:px-4 sm:text-[0.8125rem]",
                  isActive
                    ? "border-signal bg-signal text-bg shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-signal)_14%,transparent)]"
                    : isLinked
                      ? "border-signal/60 bg-bg text-ink"
                      : "border-line-strong bg-bg text-muted hover:text-ink",
                )}
                style={{ left: `${n.x}%`, top: `${(n.y / 75) * 100}%` }}
              >
                <span aria-hidden="true" className={cn("size-1.5", isActive ? "bg-bg" : isLinked ? "bg-signal" : "bg-line-strong")} />
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:col-span-4" aria-live="polite">
        <div className="pane-head">
          <p className="label">
            Node <span className="text-signal">/ {node.label.toUpperCase()}</span>
          </p>
          <p className="label text-faint">{connected.size - 1} links</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col p-5 md:p-6"
          >
            <h3 className="display text-[1.75rem] leading-tight font-semibold">{node.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{node.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {node.tech.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <p className="label mt-7 mb-2 text-faint">In my work</p>
            <ul className="border-t border-line">
              {node.workstreams.map((id) => {
                const ws = allWorkstreams.find((w) => w.id === id);
                if (!ws) return null;
                return (
                  <li key={id} className="border-b border-line">
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = id;
                        scrollToId(id);
                      }}
                      className="group flex min-h-11 items-center justify-between gap-3 py-2 text-[0.9375rem] text-ink hover:text-signal"
                    >
                      <span>
                        <span className="label mr-2 text-faint">{ws.code}</span>
                        {ws.title}
                      </span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
