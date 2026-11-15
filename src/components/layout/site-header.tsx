"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

import { useApp } from "@/components/providers";
import { Close, Download, Menu, Search } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { sections } from "@/content/site";
import { useActiveSection } from "@/lib/hooks";
import { cn, scrollToId } from "@/lib/utils";

const ids = sections.map((s) => s.id);
const EASE = [0.22, 1, 0.36, 1] as const;

export function useGo() {
  const { view, setView } = useApp();
  return (id: string) => {
    if (view === "api") {
      setView("human");
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    } else scrollToId(id);
  };
}

/** Human / API switch — a segmented control; the active segment is one surface step up. */
export function ViewToggle({ className }: { className?: string }) {
  const { view, setView } = useApp();
  return (
    <div role="group" aria-label="Page view" className={cn("flex rounded-lg border border-line bg-bg p-0.5", className)}>
      {(["human", "api"] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => setView(v)}
          className={cn(
            "min-h-8 rounded-md px-3 text-[0.8125rem] transition-[color,background-color] duration-150",
            view === v ? "bg-surface-2 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]" : "text-faint hover:text-ink",
          )}
        >
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setMod("⌘");
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <a href="#main" className="sr-only-focusable fixed top-2 left-2 z-[100] rounded-md bg-ink px-4 py-2 text-sm text-bg">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200",
          scrolled || menuOpen ? "border-line bg-bg/95" : "border-transparent bg-bg/0",
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] w-[min(100%-var(--gutter)*2,76rem)] items-center gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              if (view === "api") return;
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex shrink-0 items-center gap-2.5 text-[1rem] leading-none font-medium tracking-[-0.01em]"
            title="Back to top"
          >
            <span aria-hidden="true" className="state text-signal" />
            {profile.name}
          </a>

          <nav aria-label="Primary" className="ml-auto hidden xl:block">
            <ul className="flex items-center gap-1">
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
                        "relative flex min-h-9 items-center rounded-md px-3 text-[0.875rem] transition-colors duration-150",
                        isActive ? "text-ink" : "text-faint hover:text-ink",
                      )}
                    >
                      {isActive ? (
                        <m.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-md bg-surface-2"
                          transition={{ duration: 0.22, ease: EASE }}
                        />
                      ) : null}
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <ViewToggle className="hidden md:flex" />
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex min-h-9 items-center gap-1 rounded-lg border border-line px-2 text-faint transition-colors duration-150 hover:border-line-strong hover:text-ink"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <span className="sr-only">Open command palette</span>
              <Search size={16} className="sm:hidden" />
              <kbd className="kbd hidden sm:inline-flex">{mod}</kbd>
              <kbd className="kbd hidden sm:inline-flex">K</kbd>
            </button>
            <a href={profile.resume} download={profile.resumeFileName} className="btn btn-sm hidden sm:inline-flex">
              <Download size={16} />
              Résumé
            </a>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-line-strong xl:hidden"
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
            className="fixed inset-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto bg-bg px-[var(--gutter)] pt-4 pb-10 xl:hidden"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <nav aria-label="Mobile">
              <ul>
                {sections.map((s) => (
                  <li key={s.id} className="border-b border-line">
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        go(s.id);
                      }}
                      aria-current={current?.id === s.id ? "true" : undefined}
                      className="flex min-h-14 items-center gap-4 py-2"
                    >
                      <span className="label w-6 tabular-nums">{s.number}</span>
                      <span className={cn("display text-[1.5rem] leading-none", current?.id === s.id ? "text-ink" : "text-muted")}>{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ViewToggle />
              <a href={profile.resume} download={profile.resumeFileName} className="btn">
                <Download size={16} />
                Download résumé
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
