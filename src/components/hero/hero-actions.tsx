"use client";

import { ArrowDown, Download } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { scrollToId } from "@/lib/utils";

/** One primary and one secondary action. Contact lives in the navigation and the closing section. */
export function HeroActions() {
  return (
    <div className="fade-up flex flex-wrap gap-3" style={{ "--d": "120ms" } as React.CSSProperties}>
      <a
        href="#experience"
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("experience");
        }}
      >
        See my work
        <ArrowDown size={16} />
      </a>
      <a href={profile.resume} download={profile.resumeFileName} className="btn">
        <Download size={16} />
        Download résumé
      </a>
    </div>
  );
}
