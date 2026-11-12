"use client";

import { ArrowDown, ArrowUpRight, Download } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { profile } from "@/content/profile";
import { scrollToId } from "@/lib/utils";

export function HeroActions() {
  return (
    <div className="fade-up flex flex-wrap gap-3" style={{ "--d": "700ms" } as React.CSSProperties}>
      <Magnetic>
        <a
          href="#experience"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("experience");
          }}
        >
          Explore my work
          <ArrowDown size={15} />
        </a>
      </Magnetic>
      <Magnetic>
        <a href={profile.resume} download={profile.resumeFileName} className="btn">
          <Download size={15} />
          Download résumé
        </a>
      </Magnetic>
      <Magnetic>
        <a
          href="#contact"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("contact");
          }}
        >
          Contact me
          <ArrowUpRight size={15} className="btn-arrow" />
        </a>
      </Magnetic>
    </div>
  );
}
