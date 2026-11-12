"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { profile } from "@/content/profile";

function Letters({ word, offset }: { word: string; offset: number }) {
  return (
    <>
      {word.split("").map((ch, i) => (
        <span key={i} className="hero-letter" style={{ "--i": i + offset } as React.CSSProperties}>
          {ch}
        </span>
      ))}
    </>
  );
}

/**
 * The name condenses along Archivo's width axis as the hero scrolls away —
 * a variable-font interaction that costs one style update per frame.
 */
export function HeroName() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end start"] });
  const wdth = useTransform(scrollYProgress, [0, 1], [118, 64]);
  const wght = useTransform(scrollYProgress, [0, 1], [820, 640]);
  const settings = useTransform(() => `"wdth" ${wdth.get().toFixed(1)}, "wght" ${Math.round(wght.get())}`);

  const first = profile.firstName.toUpperCase();
  const last = profile.lastName.toUpperCase();

  return (
    <m.h1
      ref={ref}
      className="display text-[min(11.2vw,10.25rem)] leading-[0.84] tracking-[-0.025em] select-none"
      style={{ fontVariationSettings: reduce ? '"wdth" 118, "wght" 820' : settings }}
    >
      <span className="sr-only">{profile.name}</span>
      <span aria-hidden="true" className="block overflow-hidden whitespace-nowrap pt-[0.06em]">
        <Letters word={first} offset={0} />
      </span>
      <span aria-hidden="true" className="block overflow-hidden whitespace-nowrap pt-[0.06em] md:pl-[1.15em]">
        <Letters word={last} offset={first.length} />
        <span className="hero-letter text-signal" style={{ "--i": first.length + last.length } as React.CSSProperties}>
          .
        </span>
      </span>
    </m.h1>
  );
}
