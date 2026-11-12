"use client";

import { Command } from "cmdk";
import type { ReactNode } from "react";

import { useApp } from "@/components/providers";
import { ArrowRight, ArrowUpRight, Braces, Copy, Download, GitHub, LinkedIn, Mail } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { sections } from "@/content/site";
import { copyText } from "@/lib/utils";

import { useGo } from "./site-header";

function Item({ onSelect, icon, children, hint, keywords }: { onSelect: () => void; icon: ReactNode; children: ReactNode; hint?: string; keywords?: string[] }) {
  return (
    <Command.Item onSelect={onSelect} keywords={keywords}>
      <span className="flex size-7 items-center justify-center border border-line text-signal">{icon}</span>
      <span className="flex-1">{children}</span>
      {hint ? <span className="label text-faint">{hint}</span> : null}
    </Command.Item>
  );
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, view, setView, notify } = useApp();
  const go = useGo();

  const run = (fn: () => void) => () => {
    setPaletteOpen(false);
    // Let the dialog close (and restore scroll lock) before acting.
    requestAnimationFrame(fn);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = profile.resume;
    a.download = profile.resumeFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Command.Dialog open={paletteOpen} onOpenChange={setPaletteOpen} label="Command palette" loop>
      <Command.Input placeholder="Type a command or search…" />
      <Command.List>
        <Command.Empty>No matching command.</Command.Empty>
        <Command.Group heading="Navigate">
          {sections.map((s) => (
            <Item key={s.id} icon={<ArrowRight size={14} />} hint={s.number} onSelect={run(() => go(s.id))} keywords={["go", "goto", s.id]}>
              Go to {s.label}
            </Item>
          ))}
        </Command.Group>
        <Command.Group heading="Actions">
          <Item icon={<Download size={14} />} onSelect={run(download)} keywords={["cv", "resume", "pdf"]}>
            Download résumé
          </Item>
          <Item
            icon={<Copy size={14} />}
            onSelect={run(async () => notify((await copyText(profile.email)) ? "Email copied to clipboard" : profile.email))}
            keywords={["mail", "contact"]}
          >
            Copy email
          </Item>
          <Item icon={<Mail size={14} />} onSelect={run(() => (window.location.href = `mailto:${profile.email}`))} keywords={["contact"]}>
            Write an email
          </Item>
          <Item
            icon={<Braces size={14} />}
            onSelect={run(() => setView(view === "api" ? "human" : "api"))}
            keywords={["json", "developer", "human", "toggle"]}
          >
            {view === "api" ? "Switch to Human view" : "Switch to API view"}
          </Item>
        </Command.Group>
        <Command.Group heading="Links">
          <Item icon={<LinkedIn size={14} />} hint="↗" onSelect={run(() => window.open(profile.linkedin, "_blank", "noopener,noreferrer"))}>
            Open LinkedIn
          </Item>
          {profile.github ? (
            <Item icon={<GitHub size={14} />} hint="↗" onSelect={run(() => window.open(profile.github!, "_blank", "noopener,noreferrer"))}>
              Open GitHub
            </Item>
          ) : null}
          <Item icon={<ArrowUpRight size={14} />} hint="↗" onSelect={run(() => window.open("/v1/engineer/prashanth", "_blank", "noopener"))} keywords={["api", "json", "raw"]}>
            Open raw JSON endpoint
          </Item>
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="label text-faint">↑↓ navigate · ↵ select · esc close</span>
        <span className="label text-faint">PB.</span>
      </div>
    </Command.Dialog>
  );
}
