"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ViewMode = "human" | "api";

type AppState = {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (message: string) => void;
};

const AppContext = createContext<AppState | null>(null);

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<ViewMode>("human");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const setView = useCallback((next: ViewMode) => {
    setViewState(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const notify = useCallback((message: string) => setToast(message), []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ⌘K / Ctrl+K toggles the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ view, setView, paletteOpen, setPaletteOpen, toast, notify }),
    [view, setView, paletteOpen, toast, notify],
  );

  return (
    <AppContext.Provider value={value}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          {children}
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
          >
            {toast ? (
              <span className="fade-up flex items-center gap-2 border border-line-strong bg-surface px-4 py-2.5 font-mono text-[0.8125rem] text-ink shadow-2xl">
                <span className="status-dot text-signal" aria-hidden="true" />
                {toast}
              </span>
            ) : null}
          </div>
        </MotionConfig>
      </LazyMotion>
    </AppContext.Provider>
  );
}
