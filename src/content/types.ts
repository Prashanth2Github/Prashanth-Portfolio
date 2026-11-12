/**
 * Content types. Every factual field in /src/content is sourced from
 * Prashanth_Resume (2).pdf, Prashanth_Certifications.pdf, or Prashanth's own brief.
 * Fields that come only from the brief (not the résumé) are marked `source: "brief"`.
 */

export type Source = "resume" | "certificate" | "brief";

export type Link = { label: string; href: string; external?: boolean; download?: boolean };

export type Workstream = {
  id: string;
  code: string;
  title: string;
  problem: string;
  contribution: string;
  approach: string[];
  validation: string;
  tech: string[];
  /** Interactive simulation in the Systems section that illustrates this workstream, if any. */
  simulation?: { id: string; label: string };
  source: Source | Source[];
};

export type Role = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  summary: string;
  workstreams: Workstream[];
  highlights?: string[];
  evidence?: Link;
};

export type Project = {
  id: string;
  code: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  contribution: string;
  decisions: string[];
  tech: string[];
  diagram: "deadline" | "rental" | "glove";
  /** Only set when a real public URL exists. Never invent one. */
  repo?: string;
  demo?: string;
};

export type Credential = {
  id: string;
  title: string;
  shortTitle: string;
  issuer: string;
  issued: string;
  issuedISO?: string;
  validUntil?: string;
  credentialId?: string;
  credentialIdLabel?: string;
  note?: string;
  image: string;
  thumb: string;
  pdf: string;
  width: number;
  height: number;
  verifyUrl?: string;
  featured: boolean;
};

export type EvidenceRef =
  | { kind: "workstream"; id: string }
  | { kind: "project"; id: string }
  | { kind: "credential"; id: string }
  | { kind: "note"; text: string };

export type Skill = { name: string; evidence: EvidenceRef[] };

export type SkillCategory = { id: string; label: string; blurb: string; skills: Skill[] };
