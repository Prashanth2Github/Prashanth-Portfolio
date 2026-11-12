import type { EvidenceRef, SkillCategory } from "./types";

const ws = (id: string): EvidenceRef => ({ kind: "workstream", id });
const pr = (id: string): EvidenceRef => ({ kind: "project", id });
const cr = (id: string): EvidenceRef => ({ kind: "credential", id });
const note = (text: string): EvidenceRef => ({ kind: "note", text });

/** Skills come from the TECHNICAL SKILLS section of the résumé (plus Node.js, k6 and CI/CD from the brief).
 *  Evidence only points at work that actually used the skill. No ratings, by design. */
export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Programming languages",
    blurb: "What I write systems in",
    skills: [
      { name: "Go", evidence: [ws("ws-backend"), ws("ws-auth"), ws("ws-migration"), ws("ws-events")] },
      { name: "Java", evidence: [pr("vehicle-rental-system"), cr("infosys-java")] },
      { name: "Python", evidence: [pr("smart-deadline-notifier"), cr("nptel-python"), cr("cisco-pcap")] },
      { name: "SQL", evidence: [ws("ws-backend"), ws("ws-events"), pr("vehicle-rental-system")] },
      { name: "JavaScript", evidence: [pr("smart-deadline-notifier")] },
      { name: "C", evidence: [note("Core programming language — listed on résumé")] },
    ],
  },
  {
    id: "backend",
    label: "Backend development",
    blurb: "Services, APIs & workflows",
    skills: [
      { name: "REST APIs", evidence: [ws("ws-backend"), ws("ws-events")] },
      { name: "Backend services", evidence: [ws("ws-backend")] },
      { name: "API integration", evidence: [ws("ws-backend")] },
      { name: "Error handling", evidence: [ws("ws-backend"), ws("ws-migration")] },
      { name: "Temporal", evidence: [ws("ws-migration")] },
      { name: "Configuration APIs", evidence: [ws("ws-backend")] },
      { name: "Node.js", evidence: [pr("smart-deadline-notifier")] },
      { name: "Express", evidence: [pr("smart-deadline-notifier")] },
    ],
  },
  {
    id: "identity",
    label: "Identity & access",
    blurb: "Multi-tenant authentication",
    skills: [
      { name: "LDAP", evidence: [ws("ws-auth")] },
      { name: "Active Directory", evidence: [ws("ws-auth")] },
      { name: "OIDC", evidence: [ws("ws-auth")] },
      { name: "SAML", evidence: [ws("ws-auth")] },
      { name: "Keycloak", evidence: [ws("ws-auth")] },
      { name: "JIT provisioning", evidence: [ws("ws-auth")] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend development",
    blurb: "Interfaces & dashboards",
    skills: [
      { name: "React", evidence: [pr("smart-deadline-notifier")] },
      { name: "JavaScript", evidence: [pr("smart-deadline-notifier")] },
      { name: "HTML", evidence: [note("Web fundamentals — listed on résumé")] },
      { name: "CSS", evidence: [note("Web fundamentals — listed on résumé")] },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Persistence & data access",
    skills: [
      { name: "PostgreSQL", evidence: [note("Listed on résumé")] },
      { name: "MySQL", evidence: [note("Listed on résumé")] },
      { name: "MongoDB", evidence: [pr("smart-deadline-notifier")] },
      { name: "JDBC", evidence: [pr("vehicle-rental-system")] },
      { name: "Database management", evidence: [ws("ws-backend"), pr("vehicle-rental-system")] },
    ],
  },
  {
    id: "infrastructure",
    label: "Cloud & infrastructure",
    blurb: "Virtualization & operations",
    skills: [
      { name: "Virtualization", evidence: [ws("ws-infra"), ws("ws-migration")] },
      { name: "Virtual machines", evidence: [ws("ws-infra"), ws("ws-migration")] },
      { name: "Proxmox", evidence: [ws("ws-infra"), ws("ws-migration")] },
      { name: "FreeBSD", evidence: [ws("ws-infra")] },
      { name: "Cloud infrastructure", evidence: [ws("ws-infra"), cr("oci-genai"), cr("oci-ds")] },
      { name: "Linux", evidence: [ws("ws-delivery"), ws("ws-infra")] },
    ],
  },
  {
    id: "testing",
    label: "Testing & automation",
    blurb: "Proving it works — and fails safely",
    skills: [
      { name: "Integration testing", evidence: [ws("ws-testing"), ws("ws-migration")] },
      { name: "End-to-end testing", evidence: [ws("ws-testing")] },
      { name: "API testing", evidence: [ws("ws-testing"), ws("ws-events")] },
      { name: "Functional testing", evidence: [{ kind: "note", text: "Tester Intern · Wyreflow Technologies" }] },
      { name: "k6", evidence: [ws("ws-testing")] },
      { name: "CI/CD", evidence: [ws("ws-delivery")] },
      { name: "Debugging", evidence: [ws("ws-testing"), ws("ws-backend")] },
    ],
  },
  {
    id: "tools",
    label: "Developer tools",
    blurb: "Daily workflow",
    skills: [
      { name: "Git", evidence: [ws("ws-delivery")] },
      { name: "GitHub", evidence: [ws("ws-delivery")] },
      { name: "Pull requests & code review", evidence: [ws("ws-delivery")] },
      { name: "WSL", evidence: [ws("ws-delivery")] },
      { name: "VS Code", evidence: [note("Primary editor")] },
    ],
  },
  {
    id: "ai",
    label: "AI & data",
    blurb: "Models and certified foundations",
    skills: [
      { name: "Generative AI", evidence: [cr("oci-genai")] },
      { name: "Data science", evidence: [cr("oci-ds")] },
      { name: "LSTM", evidence: [pr("smart-deadline-notifier")] },
      { name: "NLP", evidence: [pr("smart-deadline-notifier")] },
    ],
  },
];
