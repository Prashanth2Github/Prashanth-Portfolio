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

const icon: Record<Status, string> = { ok: "✓", run: "◐", fail: "✕" };
const tone: Record<Status, string> = { ok: "text-signal", run: "text-run", fail: "text-fail" };
const VISIBLE = 6;

const initialLines: Line[] = EVENTS.slice(0, VISIBLE).map((e, i) => ({
  ...(e.resolvesTo && i < VISIBLE - 1 ? { ...e, ...e.resolvesTo } : e),
  seq: 1040 + i,
})).reverse();

export function EventStream() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>(initialLines);
  const cursor = useRef(VISIBLE);
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
    <div ref={ref} className="pane brackets" data-active="true">
      <div className="pane-head">
        <p className="label flex items-center gap-2.5">
          <span className="status-dot text-signal" data-live aria-hidden="true" />
          event-stream
        </p>
        <p className="label border border-line-strong px-1.5 text-run">simulated</p>
      </div>
      <ol className="min-h-[16.5rem] px-4 py-2 font-mono text-[0.8125rem] leading-none sm:text-[0.8125rem]" aria-label="Simulated backend event stream">
        <AnimatePresence initial={false} mode="popLayout">
          {lines.map((l) => (
            <m.li
              key={l.seq}
              layout="position"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-2 border-b border-line/70 py-[0.8rem] last:border-0 sm:grid-cols-[3.25rem_1.25rem_1fr_auto]"
            >
              <span className="hidden text-faint sm:block">#{l.seq}</span>
              <span className={cn("text-center", tone[l.status])}>
                <span aria-hidden="true">{icon[l.status]}</span>
                <span className="sr-only">{l.status === "ok" ? "completed" : l.status === "run" ? "processing" : "failed"}</span>
              </span>
              <span className="truncate text-ink">{l.name}</span>
              <span className={cn("truncate text-right", l.status === "ok" ? "text-muted" : tone[l.status])}>{l.detail}</span>
            </m.li>
          ))}
        </AnimatePresence>
      </ol>
      <p className="border-t border-line px-4 py-2.5 text-[0.75rem] leading-snug text-faint">
        Illustrative UI simulation of the kind of events my work produces — not live production data.
      </p>
    </div>
  );
}
