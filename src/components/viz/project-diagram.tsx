"use client";

import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useOnScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function Frame({ label, foot, children }: { label: string; foot: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[18rem] flex-col">
      <div className="pane-head">
        <p className="label">{label}</p>
        <p className="label text-faint">Illustration</p>
      </div>
      <div className="grid-lines flex flex-1 flex-col justify-center p-5 sm:p-7">{children}</div>
      <p className="label flex items-center gap-2 border-t border-line px-4 py-2.5 text-faint">{foot}</p>
    </div>
  );
}

function Deadline({ on }: { on: boolean }) {
  const rows = [
    { task: "Research", w: 0.72, tone: "bg-signal", p: "P1" },
    { task: "Design", w: 0.55, tone: "bg-info", p: "P2" },
    { task: "Review", w: 0.38, tone: "bg-run", p: "P3" },
    { task: "Archive", w: 0.18, tone: "bg-line-strong", p: "P4" },
  ];
  return (
    <Frame
      label="Task priority / LSTM"
      foot={
        <>
          <span className="state text-signal" aria-hidden="true" /> pattern learned → reminder scheduled
        </>
      }
    >
      <div className="label mb-2 grid grid-cols-[5.5rem_1fr_2rem] gap-3 text-faint">
        <span />
        <span className="flex justify-between">
          <span>now</span>
          <span>+1d</span>
          <span>+3d</span>
          <span>+7d</span>
        </span>
        <span />
      </div>
      {rows.map((r, i) => (
        <div key={r.task} className="grid h-11 grid-cols-[5.5rem_1fr_2rem] items-center gap-3 border-t border-line font-mono text-[0.8125rem]">
          <span className="text-muted">{r.task}</span>
          <span className="relative h-px bg-line">
            <m.span
              className={cn("absolute inset-y-0 left-0 origin-left", r.tone)}
              style={{ width: `${r.w * 100}%`, height: 2, top: -0.5 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: on ? 1 : 0 }}
              transition={{ duration: 1.1, delay: 0.15 * i, ease }}
            />
            <m.span
              className={cn("absolute top-1/2 size-2 -translate-y-1/2", r.tone)}
              style={{ left: `calc(${r.w * 100}% - 4px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ delay: 0.15 * i + 0.9 }}
            />
          </span>
          <span className="text-right text-ink">{r.p}</span>
        </div>
      ))}
    </Frame>
  );
}

function Rental({ on, reduce }: { on: boolean; reduce: boolean | null }) {
  const steps = ["Customer", "Vehicle", "Booking", "Return", "Service"];
  return (
    <Frame label="Rental record / lifecycle" foot={<>JDBC · SQL — one relational source of truth</>}>
      <div className="relative">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {steps.map((s, i) => (
            <m.div
              key={s}
              className="flex min-h-20 flex-col justify-between border border-line bg-bg p-2 sm:p-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease }}
            >
              <span className="label tabular-nums">0{i + 1}</span>
              <span className="font-mono text-[0.75rem] leading-tight break-words text-ink">{s}</span>
            </m.div>
          ))}
        </div>
        <div className="relative mt-4 h-px bg-line-strong">
          {on && !reduce ? (
            <m.span
              className="absolute top-1/2 size-2.5 -translate-y-1/2 bg-signal"
              initial={{ left: "0%" }}
              animate={{ left: ["0%", "97%"] }}
              transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
            />
          ) : null}
        </div>
        <div className="mx-auto mt-5 flex w-fit items-center gap-3 border border-info/50 px-3 py-2 font-mono text-[0.75rem] text-info">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <ellipse cx="8" cy="3.5" rx="6.5" ry="2.5" />
            <path d="M1.5 3.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M1.5 9c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
          </svg>
          rentals.db
        </div>
      </div>
    </Frame>
  );
}

function Glove({ on, reduce }: { on: boolean; reduce: boolean | null }) {
  return (
    <Frame label="Assistive interface / signal" foot={<>gesture recognition · real-time feedback</>}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-2">
          <div className="grid grid-cols-3 gap-1.5">
            {["bg-info", "bg-signal", "bg-run"].map((c) => (
              <span key={c} className={cn("size-2.5", c)} />
            ))}
          </div>
          <span className="label text-faint">Sensors</span>
        </div>
        <Wire on={on} reduce={reduce} />
        <div className="flex flex-col items-center gap-2">
          <div className="relative grid size-[4.5rem] place-items-center border border-signal/70 bg-bg font-mono text-[0.8125rem] text-signal">
            ESP32
            {[0, 1, 2, 3].map((i) => (
              <span key={i} aria-hidden="true" className="absolute h-px w-2 bg-signal/60" style={{ top: `${22 + i * 18}%`, left: -8 }} />
            ))}
          </div>
          <span className="label text-faint">Process</span>
        </div>
        <Wire on={on} reduce={reduce} delay={0.6} />
        <div className="flex flex-col items-center gap-2">
          <div className="relative grid size-12 place-items-center">
            {[0, 1, 2].map((i) => (
              <m.span
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-run/70"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={on && !reduce ? { scale: [0.4, 1.1], opacity: [0.9, 0] } : { scale: 0.7, opacity: 0.6 }}
                transition={on && !reduce ? { duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" } : {}}
              />
            ))}
            <span className="size-2.5 rounded-full bg-run" />
          </div>
          <span className="label text-faint">Feedback</span>
        </div>
      </div>
      <p className="label mt-6 text-center text-faint">Bluetooth link between components</p>
    </Frame>
  );
}

function Wire({ on, reduce, delay = 0 }: { on: boolean; reduce: boolean | null; delay?: number }) {
  return (
    <div className="relative h-px flex-1 bg-line-strong" aria-hidden="true">
      {on && !reduce
        ? [0, 1].map((i) => (
            <m.span
              key={i}
              className="absolute top-1/2 size-1.5 -translate-y-1/2 bg-signal"
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: delay + i * 0.7, ease: "linear" }}
            />
          ))
        : null}
    </div>
  );
}

export function ProjectDiagram({ variant }: { variant: "deadline" | "rental" | "glove" }) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref, "-10% 0px");
  const reduce = useReducedMotion();
  // Entrance animations latch once seen; looping motion only runs while visible.
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (onScreen) setSeen(true);
  }, [onScreen]);
  const shown = seen || !!reduce;
  const pauseLoops = !onScreen || !!reduce;
  return (
    <div ref={ref} className="h-full">
      {variant === "deadline" ? (
        <Deadline on={shown} />
      ) : variant === "rental" ? (
        <Rental on={shown} reduce={pauseLoops} />
      ) : (
        <Glove on={shown} reduce={pauseLoops} />
      )}
    </div>
  );
}
