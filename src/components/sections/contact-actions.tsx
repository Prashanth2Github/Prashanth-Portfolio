"use client";

import { useState } from "react";

import { useApp } from "@/components/providers";
import { ArrowUpRight, Check, Copy, Download, GitHub, LinkedIn, Mail } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { profile } from "@/content/profile";
import { copyText } from "@/lib/utils";

export function ContactActions() {
  const [copied, setCopied] = useState(false);
  const { notify } = useApp();

  return (
    <div className="flex flex-wrap gap-3">
      <Magnetic>
        <a href={`mailto:${profile.email}`} className="btn btn-primary">
          <Mail size={15} /> Email me
        </a>
      </Magnetic>
      <Magnetic>
        <button
          type="button"
          className="btn"
          onClick={async () => {
            const ok = await copyText(profile.email);
            setCopied(ok);
            notify(ok ? "Email copied to clipboard" : profile.email);
            if (ok) window.setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy email"}
        </button>
      </Magnetic>
      <Magnetic>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn">
          <LinkedIn size={15} /> LinkedIn <ArrowUpRight size={14} className="btn-arrow" />
        </a>
      </Magnetic>
      {profile.github ? (
        <Magnetic>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn">
            <GitHub size={15} /> GitHub <ArrowUpRight size={14} className="btn-arrow" />
          </a>
        </Magnetic>
      ) : null}
      <Magnetic>
        <a href={profile.resume} download={profile.resumeFileName} className="btn">
          <Download size={15} /> Résumé
        </a>
      </Magnetic>
    </div>
  );
}
