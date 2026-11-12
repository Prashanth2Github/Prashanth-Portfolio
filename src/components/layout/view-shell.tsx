"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { useApp } from "@/components/providers";

const ApiView = dynamic(() => import("./api-view").then((mod) => mod.ApiView), { ssr: false });

/** Keeps the server-rendered human view mounted (state preserved) and swaps in the API view on demand. */
export function ViewShell({ children }: { children: ReactNode }) {
  const { view } = useApp();
  return (
    <>
      <div hidden={view === "api"}>{children}</div>
      {view === "api" ? <ApiView /> : null}
    </>
  );
}
