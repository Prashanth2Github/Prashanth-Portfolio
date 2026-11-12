import { credentials } from "@/content/credentials";
import { roles } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillCategories } from "@/content/skills";
import { siteUrl } from "@/content/site";

/** The same content as the human view, shaped as an API response. Served at /v1/engineer/prashanth. */
export function buildApiPayload() {
  return {
    apiVersion: "v1",
    kind: "Engineer",
    metadata: { id: "prashanth", name: profile.name, location: profile.location },
    spec: {
      role: profile.role,
      headline: profile.headline,
      current: { title: profile.currentTitle, company: profile.company, since: "2025-12" },
      focus: [...profile.focus],
      experience: roles.map((role) => ({
        company: role.company,
        title: role.title,
        period: `${role.start} – ${role.end}`,
        workstreams: role.workstreams.length
          ? role.workstreams.map((w) => ({ id: w.id, title: w.title, tech: w.tech }))
          : role.highlights,
      })),
      projects: projects.map((p) => ({ title: p.title, category: p.category, tech: p.tech })),
      skills: Object.fromEntries(skillCategories.map((c) => [c.id, c.skills.map((s) => s.name)])),
      credentials: credentials.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        issued: c.issuedISO ?? c.issued,
        ...(c.validUntil ? { validUntil: c.validUntil } : {}),
        ...(c.credentialId ? { id: c.credentialId } : {}),
      })),
      education: profile.education.map((e) => ({ ...e })),
    },
    links: {
      self: `${siteUrl}/v1/engineer/prashanth`,
      email: `mailto:${profile.email}`,
      linkedin: profile.linkedin,
      ...(profile.github ? { github: profile.github } : {}),
      resume: `${siteUrl}${profile.resume}`,
    },
    status: { phase: "Running" },
  };
}
