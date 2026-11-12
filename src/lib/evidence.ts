import { credentials } from "@/content/credentials";
import { allWorkstreams } from "@/content/experience";
import { projects } from "@/content/projects";
import type { EvidenceRef } from "@/content/types";

export type ResolvedEvidence = { kind: EvidenceRef["kind"]; label: string; context: string; href?: string };

export function resolveEvidence(ref: EvidenceRef): ResolvedEvidence {
  switch (ref.kind) {
    case "workstream": {
      const ws = allWorkstreams.find((w) => w.id === ref.id);
      return { kind: ref.kind, label: ws?.title ?? ref.id, context: `Karios · ${ws?.code ?? ""}`, href: `#${ref.id}` };
    }
    case "project": {
      const p = projects.find((x) => x.id === ref.id);
      return { kind: ref.kind, label: p?.title ?? ref.id, context: `Project · ${p?.code ?? ""}`, href: `#project-${ref.id}` };
    }
    case "credential": {
      const c = credentials.find((x) => x.id === ref.id);
      return { kind: ref.kind, label: c?.shortTitle ?? ref.id, context: c?.issuer ?? "Credential", href: `#cred-${ref.id}` };
    }
    case "note":
      return { kind: ref.kind, label: ref.text, context: "Résumé" };
  }
}
