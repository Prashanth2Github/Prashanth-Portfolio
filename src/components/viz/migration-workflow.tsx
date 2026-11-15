"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Bolt, Play, Reset } from "@/components/ui/icons";
import { compensationStages, migrationStages } from "@/content/systems";
import { useOnScreen } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type StageStatus = "pending" | "run" | "ok" | "fail" | "undone";
type Phase = "idle" | "running" | "completed" | "compensating" | "rolledback";
type LogLine = { id: number; t: string; name: string; tone: "ok" | "run" | "fail" | "info" };

const toneClass = { ok: "text-signal", run: "text-run", fail: "text-fail", info: "text-muted" } as const;
const statusBar: Record<StageStatus, string> = {
  pending: "bg-line-strong",
  run: "bg-run",
  ok: "bg-signal",
  fail: "bg-fail",
  undone: "bg-fail/60",
};
const statusText: Record<StageStatus, string> = { pending: "pending", run: "running", ok: "done", fail: "failed", undone: "undone" };
const phaseLabel: Record<Phase, { text: string; tone: string }> = {
  idle: { text: "Idle", tone: "text-muted" },
  running: { text: "Running", tone: "text-run" },
  completed: { text: "Completed", tone: "text-signal" },
  compensating: { text: "Compensating", tone: "text-fail" },
  rolledback: { text: "Rolled back · safe", tone: "text-fail" },
};

const N = migrationStages.length;
const TRANSFER = 2;

function VmToken({ failed }: { failed?: boolean }) {
  return (
    <m.div
      layoutId="vm-token"
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={cn(
        "mt-3 flex items-center gap-2 border px-2.5 py-1.5 font-mono text-[0.75rem]",
        failed ? "border-fail/70 bg-fail/10 text-fail" : "border-signal/70 bg-signal/10 text-signal",
      )}
    >
      <span aria-hidden="true" className="grid grid-cols-2 gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-[4px] bg-current" />
        ))}
      </span>
      vm-104
    </m.div>
  );
}

export function MigrationWorkflow() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stages, setStages] = useState<StageStatus[]>(() => Array(N).fill("pending"));
  const [comp, setComp] = useState<StageStatus[]>(["pending", "pending"]);
  const [token, setToken] = useState<{ rail: "main" | "comp"; index: number }>({ rail: "main", index: 0 });
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const runId = useRef(0);
  const started = useRef(0);
  const logSeq = useRef(0);
  const autoPlayed = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref, "-20% 0px");
  const reduce = useReducedMotion();

  const reset = useCallback(() => {
    runId.current += 1;
    setPhase("idle");
    setStages(Array(N).fill("pending"));
    setComp(["pending", "pending"]);
    setToken({ rail: "main", index: 0 });
    setProgress(0);
    setLog([]);
  }, []);

  const run = useCallback(
    async (inject: boolean) => {
      reset();
      const id = runId.current;
      const alive = () => runId.current === id;
      const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 120) : ms));
      started.current = performance.now();
      const push = (name: string, tone: LogLine["tone"]) => {
        const t = `t+${((performance.now() - started.current) / 1000).toFixed(1)}s`;
        setLog((prev) => [...prev, { id: logSeq.current++, t, name, tone }].slice(-6));
      };
      const setStage = (i: number, s: StageStatus) => setStages((prev) => prev.map((v, j) => (j === i ? s : v)));

      setPhase("running");
      push(`workflow.start  migration/vm-104${inject ? "  [fault injected]" : ""}`, "info");
      await wait(350);

      for (let i = 0; i < N; i++) {
        if (!alive()) return;
        const stage = migrationStages[i]!;
        setToken({ rail: "main", index: i });
        setStage(i, "run");
        push(`migration.${stage.id}  started`, "run");

        if (i === TRANSFER) {
          const limit = inject ? 62 : 100;
          for (let p = 0; p <= limit; p += 6) {
            if (!alive()) return;
            setProgress(Math.min(p, limit));
            await wait(70);
          }
          setProgress(limit);
          if (inject) {
            await wait(300);
            if (!alive()) return;
            setStage(i, "fail");
            push("migration.transfer  failed · target unreachable", "fail");
            await wait(700);
            // Compensation: undo completed steps in reverse order.
            if (!alive()) return;
            setPhase("compensating");
            setToken({ rail: "comp", index: 0 });
            setComp(["run", "pending"]);
            push("compensation.start  reverse order", "fail");
            for (let j = i - 1; j >= 0; j--) {
              await wait(650);
              if (!alive()) return;
              setStage(j, "undone");
              push(`compensate.${migrationStages[j]!.id}  reverted`, "info");
            }
            await wait(550);
            if (!alive()) return;
            setComp(["ok", "ok"]);
            setToken({ rail: "comp", index: 1 });
            push("migration.rolled_back  source unchanged ✓", "ok");
            setPhase("rolledback");
            return;
          }
        } else {
          await wait(i === 0 ? 700 : 800);
        }
        if (!alive()) return;
        setStage(i, "ok");
        push(`migration.${stage.id}  completed`, "ok");
        await wait(180);
      }
      if (!alive()) return;
      push("workflow.complete  vm-104 on target ✓", "ok");
      setPhase("completed");
    },
    [reduce, reset],
  );

  // Play the happy path once, the first time the simulation scrolls into view.
  useEffect(() => {
    if (onScreen && !autoPlayed.current && !reduce) {
      autoPlayed.current = true;
      void run(false);
    }
  }, [onScreen, reduce, run]);

  useEffect(() => () => void (runId.current += 1), []);

  const busy = phase === "running" || phase === "compensating";
  const pl = phaseLabel[phase];

  return (
    <div ref={ref} id="sim-migration" className="pane brackets scroll-mt-28" data-active="true">
      <div className="pane-head flex-wrap">
        <p className="label">
          <span className="text-faint">SIM-01</span> · VM migration workflow
        </p>
        <p className={cn("label flex items-center gap-2", pl.tone)} aria-live="polite">
          <span className="status-dot" data-live={busy || undefined} aria-hidden="true" />
          {pl.text}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-line p-4 md:px-6">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => run(false)} disabled={busy}>
          <Play size={16} /> Run migration
        </button>
        <button type="button" className="btn btn-sm border-fail/60 text-fail" onClick={() => run(true)} disabled={busy}>
          <Bolt size={16} /> Simulate failure
        </button>
        <button type="button" className="btn btn-sm" onClick={reset}>
          <Reset size={16} /> Reset
        </button>
        <p className="label ml-auto hidden text-faint lg:block">Conceptual model · not Karios&apos;s implementation</p>
      </div>

      <div className="p-4 md:p-6">
        {/* Main rail */}
        <p className="label mb-3 text-faint">Happy path</p>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-5">
          {migrationStages.map((s, i) => {
            const st = stages[i]!;
            const here = token.rail === "main" && token.index === i;
            return (
              <li key={s.id} className={cn("relative bg-bg p-4 transition-colors duration-500", st === "run" && "bg-surface")}>
                <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[2px] transition-colors duration-500", statusBar[st])} />
                <div className="flex items-center justify-between">
                  <span className="label text-faint">0{i + 1}</span>
                  <span className={cn("label", st === "pending" ? "text-faint" : st === "ok" ? "text-signal" : st === "run" ? "text-run" : "text-fail")}>
                    {statusText[st]}
                  </span>
                </div>
                <p className={cn("display mt-2 text-[1.25rem] font-medium", st === "undone" && "text-muted line-through decoration-fail/70")}>{s.label}</p>
                <p className="mt-1 text-[0.875rem] leading-snug text-muted">{s.detail}</p>
                {i === TRANSFER && (st === "run" || st === "fail" || st === "ok" || st === "undone") ? (
                  <div className="mt-3 h-1 w-full bg-line" role="progressbar" aria-label="Transfer progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <div className={cn("h-full transition-[width] duration-100", st === "fail" || st === "undone" ? "bg-fail" : "bg-run")} style={{ width: `${progress}%` }} />
                  </div>
                ) : null}
                {here ? <VmToken failed={st === "fail"} /> : null}
              </li>
            );
          })}
        </ol>

        {/* Compensation rail */}
        <div className={cn("mt-5 transition-opacity duration-500", phase === "compensating" || phase === "rolledback" ? "opacity-100" : "opacity-45")}>
          <p className="label mb-3 flex items-center gap-2 text-faint">
            <span className="text-fail">↳</span> Failure path
          </p>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 md:w-[calc(40%-1px)]">
            {compensationStages.map((s, i) => {
              const st = comp[i]!;
              const here = token.rail === "comp" && token.index === i;
              return (
                <li key={s.id} className={cn("relative bg-bg p-4", st === "run" && "bg-surface")}>
                  <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[2px] transition-colors duration-500", st === "pending" ? "bg-line-strong" : st === "run" ? "bg-run" : "bg-fail")} />
                  <p className={cn("display text-[1.125rem] font-medium", st !== "pending" && "text-fail")}>{s.label}</p>
                  <p className="mt-1 text-[0.875rem] leading-snug text-muted">{s.detail}</p>
                  {here ? <VmToken failed /> : null}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Event log */}
        <div className="mt-5 border border-line bg-[#090b0a]">
          <p className="label border-b border-line px-4 py-2 text-faint">workflow events</p>
          <ol className="min-h-[11.5rem] px-4 py-2 font-mono text-[0.8125rem] leading-[1.9]" aria-live="polite" aria-label="Workflow event log">
            {log.length === 0 ? <li className="text-faint">Press “Run migration” or “Simulate failure”.</li> : null}
            <AnimatePresence initial={false}>
              {log.map((l) => (
                <m.li key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                  <span className="w-14 shrink-0 text-faint">{l.t}</span>
                  <span className={cn("min-w-0 break-words whitespace-pre-wrap", toneClass[l.tone])}>{l.name}</span>
                </m.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
        <p className="label mt-3 text-faint lg:hidden">Conceptual model · not Karios&apos;s implementation</p>
      </div>
    </div>
  );
}
