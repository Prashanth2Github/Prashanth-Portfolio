"use client";

import { AnimatePresence, m } from "motion/react";
import { useRef, useState } from "react";

import { ArrowRight } from "@/components/ui/icons";
import { skillCategories } from "@/content/skills";
import { resolveEvidence } from "@/lib/evidence";
import { cn } from "@/lib/utils";

const kindLabel = { workstream: "Work", project: "Project", credential: "Credential", note: "Résumé" } as const;
const kindTone = { workstream: "text-signal border-signal/50", project: "text-info border-info/50", credential: "text-run border-run/50", note: "text-muted border-line-strong" } as const;

export function SkillsExplorer() {
  const [catId, setCatId] = useState(skillCategories[0]!.id);
  const category = skillCategories.find((c) => c.id === catId) ?? skillCategories[0]!;
  const [skillName, setSkillName] = useState(category.skills[0]!.name);
  const skill = category.skills.find((s) => s.name === skillName) ?? category.skills[0]!;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectCategory = (id: string) => {
    const next = skillCategories.find((c) => c.id === id)!;
    setCatId(id);
    setSkillName(next.skills[0]!.name);
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const n = (i + delta + skillCategories.length) % skillCategories.length;
    selectCategory(skillCategories[n]!.id);
    tabRefs.current[n]?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Categories */}
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] lg:col-span-4 lg:mx-0 lg:overflow-visible lg:px-0">
        <div role="tablist" aria-label="Skill categories" aria-orientation="vertical" className="flex gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-line">
          {skillCategories.map((c, i) => {
            const active = c.id === catId;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`skilltab-${c.id}`}
                aria-selected={active}
                aria-controls="skill-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => selectCategory(c.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "relative flex shrink-0 items-center gap-3 border px-3 py-2.5 text-left transition-colors lg:border-0 lg:border-b lg:border-line lg:px-2 lg:py-4",
                  active ? "border-signal text-ink lg:bg-surface" : "border-line text-muted hover:text-ink",
                )}
              >
                {active ? <m.span layoutId="skill-tab-bar" aria-hidden="true" className="absolute top-0 bottom-0 left-0 hidden w-[2px] bg-signal lg:block" /> : null}
                <span className={cn("label hidden lg:block", active ? "text-signal" : "text-faint")}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col">
                  <span className="text-[0.9375rem] font-medium whitespace-nowrap">{c.label}</span>
                  <span className="label hidden text-faint normal-case lg:block">{c.blurb}</span>
                </span>
                <span className="label ml-auto hidden text-faint lg:block">{c.skills.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div id="skill-panel" role="tabpanel" aria-labelledby={`skilltab-${category.id}`} className="pane lg:col-span-8">
        <div className="pane-head">
          <p className="label">
            <span className="text-signal">{category.label}</span>
          </p>
          <p className="label text-faint">No ratings · evidence only</p>
        </div>
        <div className="p-5 md:p-7">
          <AnimatePresence mode="wait" initial={false}>
            <m.ul
              key={category.id}
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              aria-label={`${category.label} skills`}
            >
              {category.skills.map((s) => {
                const active = s.name === skill.name;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSkillName(s.name)}
                      onMouseEnter={() => setSkillName(s.name)}
                      className={cn(
                        "display min-h-12 border px-4 text-[clamp(1.0625rem,1.6vw,1.375rem)] font-semibold transition-all duration-200",
                        active ? "border-signal bg-signal text-bg" : "border-line text-ink hover:border-line-strong hover:bg-surface-2",
                      )}
                    >
                      {s.name}
                    </button>
                  </li>
                );
              })}
            </m.ul>
          </AnimatePresence>

          <div className="mt-8 border-t border-line pt-5" aria-live="polite">
            <p className="label mb-3 text-faint">
              Where <span className="text-ink">{skill.name}</span> shows up
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <m.ul key={`${category.id}-${skill.name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="divide-y divide-line border-y border-line">
                {skill.evidence.map((ref, i) => {
                  const ev = resolveEvidence(ref);
                  const content = (
                    <>
                      <span className={cn("chip w-24 justify-center", kindTone[ev.kind])}>{kindLabel[ev.kind]}</span>
                      <span className="flex-1">
                        <span className="block text-[0.9375rem] text-ink">{ev.label}</span>
                        <span className="label text-faint normal-case">{ev.context}</span>
                      </span>
                      {ev.href ? <ArrowRight size={14} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-signal" /> : null}
                    </>
                  );
                  return (
                    <li key={i}>
                      {ev.href ? (
                        <a
                          href={ev.href}
                          className="group flex min-h-14 items-center gap-4 py-2 hover:bg-surface/60"
                          onClick={(e) => {
                            e.preventDefault();
                            const id = ev.href!.slice(1);
                            window.location.hash = id;
                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex min-h-14 items-center gap-4 py-2">{content}</div>
                      )}
                    </li>
                  );
                })}
              </m.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
