"use client";

import { AnimatePresence, m, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { useApp } from "@/components/providers";
import { Close, Download, Menu, Search } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { sections } from "@/content/site";
import { useActiveSection } from "@/lib/hooks";
import { cn, scrollToId } from "@/lib/utils";

const ids = sections.map((s) => s.id);

export function useGo() {
  const { view, setView } = useApp();
  return (id: string) => {
    if (view === "api") {
      setView("human");
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    } else scrollToId(id);
  };
}

export function ViewToggle({ className }: { className?: string }) {
  const { view, setView } = useApp();
  return (
    <div role="group" aria-label="Page view" className={cn("relative flex border border-line p-0.5", className)}>
      {(["human", "api"] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className={cn(
            "relative z-10 min-h-8 px-2.5 font-mono text-[0.75rem] tracking-[0.06em] uppercase transition-colors",
            view === v ? "text-bg" : "text-muted hover:text-ink",
          )}
        >
          {view === v ? (
            <m.span layoutId="view-pill" className="absolute inset-0 -z-10 bg-signal" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          ) : null}
          {v === "human" ? "Human" : "API"}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const active = useActiveSection(ids);
  const { view, setPaletteOpen } = useApp();
  const go = useGo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mod, setMod] = useState("Ctrl");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setMod("⌘");
  }, []);

  // Switching between Human and API views closes the mobile menu so the new view is visible.
  useEffect(() => {
    setMenuOpen(false);
  }, [view]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const current = view === "api" ? null : sections.find((s) => s.id === active);

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed top-2 left-2 z-[100] bg-signal px-4 py-2 font-mono text-sm text-bg">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
        <m.div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left bg-signal" style={{ scaleX: progress }} />
        <div className="flex h-[var(--header-h)] items-center gap-4 px-[var(--gutter)]">
          {/* Monogram + live section index */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              if (view === "api") return;
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="display shrink-0 text-[1.375rem] leading-none font-bold"
            title={`${profile.name} — back to top`}
          >
            PB<span className="text-signal">.</span>
            <span className="sr-only"> — {profile.name}, back to top</span>
          </a>
          <span aria-hidden="true" className="hidden h-5 w-px bg-line-strong sm:block" />
          <div className="label hidden min-w-[9.5rem] overflow-hidden sm:block" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={view === "api" ? "api" : (current?.id ?? "index")}
                className="block whitespace-nowrap"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {view === "api" ? (
                  <>
                    <span className="text-signal">GET</span> /v1/engineer
                  </>
                ) : (
                  <>
                    <span className="text-signal">{current?.number ?? "00"}</span>
                    <span className="text-faint"> / 07 · </span>
                    {current?.label ?? "Index"}
                  </>
                )}
              </m.span>
            </AnimatePresence>
          </div>

          {/* Desktop navigation with sliding pill */}
          <nav aria-label="Primary" className="ml-auto hidden xl:block">
            <ul className="flex items-center">
              {sections.map((s) => {
                const isActive = current?.id === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.id);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative flex min-h-9 items-center gap-1.5 px-3 font-mono text-[0.75rem] tracking-[0.06em] uppercase transition-colors",
                        isActive ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      {isActive ? (
                        <m.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 border border-line-strong bg-surface-2"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      ) : null}
                      <span className={isActive ? "text-signal" : "text-faint"}>{s.number}</span>
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-4">
            <ViewToggle className="hidden md:flex" />
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex min-h-9 items-center gap-2 border border-line px-2.5 font-mono text-[0.75rem] text-muted transition-colors hover:border-line-strong hover:text-ink"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <span className="sr-only">Open command palette</span>
              <Search size={15} className="sm:hidden" />
              <kbd className="hidden font-mono sm:inline">{mod}</kbd>
              <kbd className="hidden font-mono sm:inline">K</kbd>
            </button>
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-primary btn-sm hidden sm:inline-flex">
              <Download size={14} />
              Résumé
            </a>
            <button
              type="button"
              className="flex size-10 items-center justify-center border border-line text-ink xl:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <Close size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {menuOpen ? (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto bg-bg px-[var(--gutter)] pt-6 pb-10 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Mobile">
              <ul>
                {sections.map((s, i) => (
                  <m.li
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        go(s.id);
                      }}
                      className="flex min-h-16 items-baseline gap-4 py-3"
                    >
                      <span className="label text-signal">{s.number}</span>
                      <span className="display text-[2rem] leading-none font-semibold">{s.label}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ViewToggle />
              <a href={profile.resume} download={profile.resumeFileName} className="btn btn-primary">
                <Download size={15} />
                Download résumé
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
