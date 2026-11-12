"use client";

import { useEffect, useRef } from "react";

import { useOnScreen } from "@/lib/hooks";

/**
 * Architectural grid with a cursor spotlight and sparse "traffic" pulses.
 * Pointer position is written straight to CSS variables (no React re-renders).
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-paused={!onScreen}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--mx": "72%", "--my": "38%" } as React.CSSProperties}
    >
      <div
        className="grid-lines draw-grid absolute inset-0"
        style={{ maskImage: "radial-gradient(ellipse 90% 80% at 50% 35%, #000 30%, transparent 100%)" }}
      />
      <div
        className="grid-lines-bright absolute inset-0"
        style={{ maskImage: "radial-gradient(260px circle at var(--mx) var(--my), #000 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), color-mix(in oklab, var(--color-signal) 7%, transparent), transparent 70%)",
        }}
      />
      {/* Traffic pulses aligned to the 64px grid */}
      <span className="pulse-h top-[192px] left-0" style={{ "--d": "1.2s", "--dur": "10s" } as React.CSSProperties} />
      <span className="pulse-h top-[448px] left-0" style={{ "--d": "5.5s", "--dur": "12s" } as React.CSSProperties} />
      <span className="pulse-v top-0 left-[64.0%]" style={{ "--d": "3s", "--dur": "13s" } as React.CSSProperties} />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
