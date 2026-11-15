"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useOnScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Status = "ok" | "run" | "fail";
type Event = { name: string; detail: string; status: Status; resolvesTo?: { status: Status; detail: string } };

/** Illustrative events modelled on the kind of work in the résumé. Not real production data. */
const EVENTS: Event[] = [
  { name: "auth.oidc.login", detail: "tenant-a · 142ms", status: "ok" },
  { name: "vm.migration.transfer", detail: "64%", status: "run", resolvesTo: { status: "ok", detail: "100% · verified" } },
  { name: "config.resolve", detail: "2 secrets masked", status: "ok" },
  { name: "api.request", detail: "GET /vms · 200 · 38ms", status: "ok" },
  { name: "events.emit", detail: "vm.snapshot.created", status: "ok" },
  { name: "auth.saml.assertion", detail: "signature verified", status: "ok" },
  { name: "vm.migration.cutover", detail: "attempt 1 · timeout", status: "fail" },
  { name: "workflow.retry", detail: "attempt 2/3", status: "run", resolvesTo: { status: "ok", detail: "attempt 2/3 · completed" } },
  { name: "auth.ldap.bind", detail: "tenant-c · ok", status: "ok" },
  { name: "user.jit_provision", detail: "tenant-b · created", status: "ok" },
  { name: "api.request", detail: "POST /migrations · 202", status: "ok" },
  { name: "alerts.dispatch", detail: "migration.failed → ops", status: "ok" },
];

type Line = Event & { seq: number };

const tone: Record<Status, string> = { ok: "text-signal", run: "text-run", fail: "text-fail" };
const VISIBLE = 6;

/** Opens mid-story: a cutover that timed out and the retry now running. */
const FIRST = 2;
const initialLines: Line[] = EVENTS.slice(FIRST, FIRST + VISIBLE).map((e, i) => ({
  ...(e.resolvesTo && i < VISIBLE - 1 ? { ...e, ...e.resolvesTo } : e),
  seq: 1040 + i,
})).reverse();

export function EventStream() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>(initialLines);
  const cursor = useRef(FIRST + VISIBLE);
  const seq = useRef(1040 + VISIBLE);

  useEffect(() => {
    if (!onScreen || reduce) return;
    const timers: number[] = [];
    const tick = () => {
      if (document.hidden) return;
      const ev = EVENTS[cursor.current % EVENTS.length]!;
      cursor.current += 1;
      const line: Line = { ...ev, seq: seq.current++ };
      setLines((prev) => [line, ...prev].slice(0, VISIBLE));
      if (ev.resolvesTo) {
        const target = line.seq;
        timers.push(
          window.setTimeout(() => {
            setLines((prev) => prev.map((l) => (l.seq === target ? { ...l, ...ev.resolvesTo! } : l)));
          }, 1400),
        );
      }
    };
    const id = window.setInterval(tick, 1900);
    return () => {
      window.clearInterval(id);
      timers.forEach(window.clearTimeout);
    };
  }, [onScreen, reduce]);

  return (
    <div ref={ref} className="pane">
      <div className="pane-head">
        <p className="text-[0.875rem] font-medium text-ink">Event stream</p>
        <p className="label flex items-center gap-4">
          <span className="hidden items-center gap-1.5 sm:flex"><span className="state text-signal" aria-hidden="true" /> ok</span>
          <span className="hidden items-center gap-1.5 sm:flex"><span className="state text-run" aria-hidden="true" /> running</span>
          <span className="hidden items-center gap-1.5 sm:flex"><span className="state text-fail" aria-hidden="true" /> failed</span>
          <span className="text-muted sm:hidden">Simulated</span>
        </p>
      </div>
      <ol className="min-h-[18.75rem] px-4 py-2 font-mono text-[0.8125rem] leading-none" aria-label="Simulated backend event stream">
        <AnimatePresence initial={false} mode="popLayout">
          {lines.map((l) => (
            <m.li
              key={l.seq}
              layout="position"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="grid h-12 grid-cols-[1rem_1fr_auto] items-center gap-3 border-b border-line last:border-0 sm:grid-cols-[3rem_1rem_1fr_auto]"
            >
              <span className="hidden text-faint tabular-nums sm:block">{l.seq}</span>
              <span className={cn("flex items-center", tone[l.status])}>
                <span className="state" aria-hidden="true" />
                <span className="sr-only">{l.status === "ok" ? "completed" : l.status === "run" ? "processing" : "failed"}</span>
              </span>
              <span className="truncate text-ink">{l.name}</span>
              <span className={cn("truncate text-right", l.status === "ok" ? "text-muted" : tone[l.status])}>{l.detail}</span>
            </m.li>
          ))}
        </AnimatePresence>
      </ol>
      <p className="border-t border-line px-4 py-3 text-[0.8125rem] leading-snug text-faint">
        A simulation of the kind of events my work produces, not production data
      </p>
    </div>
  );
}
