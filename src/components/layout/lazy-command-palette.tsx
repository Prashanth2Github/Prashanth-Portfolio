"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useApp } from "@/components/providers";

const CommandPalette = dynamic(() => import("./command-palette").then((mod) => mod.CommandPalette), { ssr: false });

/** cmdk + its dialog only download the first time the palette is opened (⌘K / Ctrl+K or the header button). */
export function LazyCommandPalette() {
  const { paletteOpen } = useApp();
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (paletteOpen) setRequested(true);
  }, [paletteOpen]);
  return requested ? <CommandPalette /> : null;
}
