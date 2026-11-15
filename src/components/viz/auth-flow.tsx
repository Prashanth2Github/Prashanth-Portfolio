"use client";

import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Reset } from "@/components/ui/icons";
import { authFlows, authLanes, type AuthProtocol } from "@/content/systems";
import { useOnScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const laneIndex = Object.fromEntries(authLanes.map((l, i) => [l.id, i])) as Record<string, number>;
const protocols = Object.keys(authFlows) as AuthProtocol[];
const W = 100 / authLanes.length;

export function AuthFlow() {
  const [protocol, setProtocol] = useState<AuthProtocol>("oidc");
  const [shown, setShown] = useState(0);
  const [cycle, setCycle] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref, "-15% 0px");
  const reduce = useReducedMotion();
  const flow = authFlows[protocol];
  const [armed, setArmed] = useState(false);

  // Arm once the diagram is first seen; after that it never resets just because it scrolled away.
  useEffect(() => {
    if (onScreen) setArmed(true);
  }, [onScreen]);

  // Reveal steps one by one whenever the protocol changes or a replay is requested.
  useEffect(() => {
    if (!armed) return;
    if (reduce) {
      setShown(flow.steps.length);
      return;
    }
    setShown(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= flow.steps.length) window.clearInterval(id);
    }, 620);
    return () => window.clearInterval(id);
  }, [protocol, cycle, armed, reduce, flow.steps.length]);

  const done = shown >= flow.steps.length;

  return (
    <div ref={ref} id="sim-auth" className="pane brackets flex w-full scroll-mt-28 flex-col" data-active="true">
      <div className="pane-head">
        <p className="label">
          <span className="text-faint">SIM-02</span> · Multi-tenant authentication
        </p>
        <p className={cn("label flex items-center gap-2", done ? "text-signal" : "text-run")}>
          <span className="status-dot" aria-hidden="true" />
          {done ? "Session issued" : `Step ${Math.min(shown + 1, flow.steps.length)}/${flow.steps.length}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-line p-4 md:px-6">
        <div role="tablist" aria-label="Authentication protocol" className="flex border border-line p-0.5">
          {protocols.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={protocol === p}
              onClick={() => setProtocol(p)}
              className={cn(
                "relative min-h-9 px-4 font-mono text-[0.8125rem] transition-colors",
                protocol === p ? "text-bg" : "text-muted hover:text-ink",
              )}
            >
              {protocol === p ? <m.span layoutId="auth-tab" className="absolute inset-0 -z-0 bg-info" transition={{ type: "spring", stiffness: 500, damping: 40 }} /> : null}
              <span className="relative">{authFlows[p].label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-sm" onClick={() => setCycle((c) => c + 1)}>
          <Reset size={16} /> Replay
        </button>
      </div>

      <div className="flex-1 p-4 md:p-6" role="tabpanel" aria-label={`${flow.label} sequence`}>
        <p className="mb-5 text-[0.9375rem] text-muted">{flow.tagline}</p>

        <div className="relative">
          {/* Lane headers + lifelines */}
          <div className="grid grid-cols-5 border-b border-line pb-2">
            {authLanes.map((l) => (
              <p key={l.id} className="label text-center text-ink">
                {l.label}
              </p>
            ))}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 bottom-0">
            {authLanes.map((l, i) => (
              <span key={l.id} className="absolute top-0 bottom-0 w-px border-l border-dashed border-line-strong/70" style={{ left: `${(i + 0.5) * W}%` }} />
            ))}
          </div>

          <ol className="relative">
            {flow.steps.map((s, i) => {
              const a = laneIndex[s.from]!;
              const b = laneIndex[s.to]!;
              const self = a === b;
              const left = (Math.min(a, b) + 0.5) * W;
              const width = Math.abs(b - a) * W;
              const visible = i < shown;
              const forward = b >= a;
              return (
                <li key={`${protocol}-${i}`} className={cn("relative pt-4 pb-2 transition-opacity duration-500", visible ? "opacity-100" : "opacity-15")}>
                  <div className="relative h-4">
                    {self ? (
                      <span
                        className={cn("absolute top-0 flex h-4 -translate-x-1/2 items-center justify-center border px-2 font-mono text-[0.6875rem] leading-none", visible ? "border-info bg-bg text-info" : "border-line bg-bg text-faint")}
                        style={{ left: `${(a + 0.5) * W}%` }}
                        aria-hidden="true"
                      >
                        ↻
                      </span>
                    ) : (
                      <span className="absolute top-1/2 h-px" style={{ left: `${left}%`, width: `${width}%` }} aria-hidden="true">
                        <span className={cn("absolute inset-0 transition-colors duration-500", visible ? "bg-info" : "bg-line-strong")} />
                        <span
                          className={cn(
                            "absolute top-1/2 size-0 -translate-y-1/2 border-y-[5px] border-y-transparent transition-colors duration-500",
                            forward ? "right-0 border-l-[7px]" : "left-0 border-r-[7px]",
                            visible ? (forward ? "border-l-info" : "border-r-info") : forward ? "border-l-line-strong" : "border-r-line-strong",
                          )}
                        />
                        {visible && !reduce ? (
                          <m.span
                            key={`${cycle}-${protocol}`}
                            className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-signal"
                            initial={{ left: forward ? "0%" : "100%", opacity: 1 }}
                            animate={{ left: forward ? "100%" : "0%", opacity: [1, 1, 0] }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        ) : null}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="label shrink-0 text-faint">0{i + 1}</span>
                    <span className="flex-1 text-[0.9375rem] leading-snug text-ink">{s.label}</span>
                    <span className={cn("chip hidden shrink-0 sm:inline-flex", visible ? "border-info/60 text-info" : "text-faint")}>{s.status}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <p className="label border-t border-line px-4 py-3 text-faint md:px-6">Standard protocol flows · tenant names are placeholders</p>
    </div>
  );
}
