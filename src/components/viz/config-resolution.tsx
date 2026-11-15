"use client";

import { AnimatePresence, m } from "motion/react";
import { useMemo, useState } from "react";

import { Lock, Search } from "@/components/ui/icons";
import { configEntries, configSources, type ConfigSourceId } from "@/content/systems";
import { cn } from "@/lib/utils";

const MASK = "••••••••";
const sourceTone: Record<ConfigSourceId, string> = { defaults: "text-muted border-line-strong", database: "text-info border-info/60", runtime: "text-run border-run/60" };

export function ConfigResolution() {
  const [enabled, setEnabled] = useState<Record<ConfigSourceId, boolean>>({ defaults: true, database: true, runtime: true });
  const [query, setQuery] = useState("");
  const [denied, setDenied] = useState(0);

  const resolved = useMemo(() => {
    const order = [...configSources].sort((a, b) => b.priority - a.priority);
    return configEntries
      .filter((e) => e.key.includes(query.trim().toLowerCase()))
      .map((e) => {
        const winner = order.find((s) => enabled[s.id] && e.values[s.id] !== undefined);
        return { ...e, from: winner?.id ?? null, value: winner ? e.values[winner.id]! : null };
      });
  }, [enabled, query]);

  return (
    <div id="sim-config" className="pane brackets flex w-full scroll-mt-28 flex-col" data-active="true">
      <div className="pane-head">
        <p className="label">
          <span className="text-faint">SIM-03</span> · Configuration resolution
        </p>
        <p className="label flex items-center gap-2 text-signal">
          <Lock size={16} /> Read-only
        </p>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <p className="mb-5 text-[0.9375rem] text-muted">
          Values resolve from multiple sources by priority. Toggle a source to see what changes — secrets are masked at every layer.
        </p>

        {/* Sources */}
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {configSources.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={enabled[s.id]}
              onClick={() => setEnabled((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
              className={cn("flex min-h-[4.5rem] flex-col items-start justify-between bg-bg p-3 text-left transition-colors sm:p-4", enabled[s.id] ? "" : "bg-surface/40")}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className={cn("label", enabled[s.id] ? sourceTone[s.id].split(" ")[0] : "text-faint line-through")}>{s.label}</span>
                <span aria-hidden="true" className={cn("relative hidden h-4 w-7 shrink-0 rounded-full border transition-colors sm:block", enabled[s.id] ? "border-ink/60 bg-ink/15" : "border-line-strong")}>
                  <span className={cn("absolute top-[2px] size-2.5 rounded-full transition-[color,background-color,border-color,opacity,transform] duration-300", enabled[s.id] ? "left-[13px] bg-ink" : "left-[2px] bg-faint")} />
                </span>
              </span>
              <span className="mt-2 text-[0.8125rem] leading-snug text-faint">
                P{s.priority} · <span className="hidden sm:inline">{s.note}</span>
                <span className="sm:hidden">{s.label === "Defaults" ? "base" : "override"}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="label my-3 text-center text-faint">runtime ▸ database ▸ defaults</p>

        {/* Resolved */}
        <div className="border border-line">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search size={16} className="shrink-0 text-faint" />
            <label htmlFor="config-search" className="sr-only">
              Filter configuration keys
            </label>
            <input
              id="config-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filter keys…"
              className="h-11 w-full bg-transparent font-mono text-[0.875rem] text-ink outline-none placeholder:text-faint"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <ul className="divide-y divide-line font-mono text-[0.8125rem]" aria-live="polite">
            <AnimatePresence initial={false}>
              {resolved.map((e) => (
                <m.li key={e.key} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-3 py-2.5 sm:grid-cols-[1fr_7rem_6rem]">
                  <span className="truncate text-ink">{e.key}</span>
                  <m.span key={`${e.key}-${e.value}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={cn("text-right sm:text-left", e.secret ? "text-faint" : e.value ? "text-ink" : "text-fail")}>
                    {e.value === null ? "unset" : e.secret ? MASK : e.value}
                  </m.span>
                  <span className="col-span-2 flex gap-1.5 sm:col-span-1 sm:justify-end">
                    {e.from ? <span className={cn("chip min-h-6 px-1.5 text-[0.75rem]", sourceTone[e.from])}>{e.from}</span> : null}
                    {e.secret ? <span className="chip min-h-6 border-fail/50 px-1.5 text-[0.75rem] text-fail">masked</span> : null}
                  </span>
                </m.li>
              ))}
            </AnimatePresence>
            {resolved.length === 0 ? <li className="px-3 py-3 text-faint">No keys match “{query}”.</li> : null}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" key={denied} className={cn("btn btn-sm", denied > 0 && "shake border-fail/60 text-fail")} onClick={() => setDenied((d) => d + 1)}>
            <Lock size={16} /> Reveal secrets
          </button>
          <p className={cn("text-[0.875rem]", denied ? "text-fail" : "text-faint")} aria-live="polite">
            {denied ? "403 · Sensitive values are never returned — masked by design." : "Try it."}
          </p>
        </div>
      </div>
      <p className="label border-t border-line px-4 py-3 text-faint md:px-6">Illustrative keys · not real configuration</p>
    </div>
  );
}
