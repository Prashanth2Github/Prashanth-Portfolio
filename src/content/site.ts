export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const sections = [
  { id: "experience", number: "01", label: "Experience" },
  { id: "systems", number: "02", label: "Systems" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "skills", number: "04", label: "Skills" },
  { id: "credentials", number: "05", label: "Certifications" },
  { id: "about", number: "06", label: "About" },
  { id: "contact", number: "07", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const seo = {
  title: "Prashanth Bonkuru — Software Engineer",
  description:
    "Software Engineer at Karios, Hyderabad — Go services and REST APIs, multi-tenant authentication (LDAP, OIDC, SAML), Temporal workflows, VM migration and cloud infrastructure.",
};
