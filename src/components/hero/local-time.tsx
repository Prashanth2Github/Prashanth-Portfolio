"use client";

import { useClock } from "@/lib/hooks";

export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useClock(timeZone);
  return <span suppressHydrationWarning>{time ?? "--:--"} IST</span>;
}
