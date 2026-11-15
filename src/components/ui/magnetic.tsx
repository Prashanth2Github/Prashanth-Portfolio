import type { ReactNode } from "react";

/**
 * Formerly pulled buttons toward the pointer. Hover feedback is now a colour/surface step on the
 * button itself, so this is a plain inline wrapper kept for layout compatibility.
 */
export function Magnetic({ children, className }: { children: ReactNode; strength?: number; className?: string }) {
  return <span className={className ?? "inline-flex"}>{children}</span>;
}
