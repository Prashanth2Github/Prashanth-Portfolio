export const profile = {
  name: "Prashanth Bonkuru",
  firstName: "Prashanth",
  lastName: "Bonkuru",
  initials: "PB",
  /** Professional identity used for positioning. Current job title is in experience.ts. */
  role: "Software Engineer",
  currentTitle: "Systems Engineer",
  company: "Karios AI",
  location: "Hyderabad, India",
  timezone: "Asia/Kolkata",
  email: "bonkuruprashanth05@gmail.com",
  linkedin: "https://www.linkedin.com/in/prashanth-bonkuru",
  /** No public GitHub profile URL was provided. Add it here and it appears everywhere (contact, ⌘K, API view). */
  github: null as string | null,
  resume: "/resume/Prashanth_Bonkuru_Resume.pdf",
  resumeFileName: "Prashanth_Bonkuru_Resume.pdf",

  headline: "Software Engineer building backend systems, intelligent workflows and reliable infrastructure.",
  intro:
    "Systems Engineer at Karios AI, Hyderabad. I build Go services and REST APIs, multi-tenant authentication across LDAP, OIDC and SAML, and Temporal-driven VM migration workflows — and I validate them end to end, failure paths included.",

  focus: ["Go · REST APIs", "LDAP · OIDC · SAML", "Temporal workflows", "Proxmox · FreeBSD", "2× OCI Professional 2025"],

  about: [
    "Computer Science graduate from Vasavi College of Engineering, Hyderabad — and since December 2025, a backend engineer on a cloud infrastructure and virtualization platform at Karios AI.",
    "My work sits where services, identity and infrastructure meet: APIs that validate before they act, login flows that respect tenant boundaries, and long-running workflows that know what to do when a step fails.",
    "I like the parts that are easy to skip — error handling, event trails, and testing the failure scenario as carefully as the happy path.",
  ],

  principles: [
    { title: "Validate before acting", text: "Requests are checked before anything changes state." },
    { title: "Design the failure path", text: "Cancellation, compensation and rollback are features, not afterthoughts." },
    { title: "Leave an event trail", text: "Every success and failure should be visible to the people operating the system." },
  ],

  education: [
    {
      qualification: "B.Tech · Computer Science and Engineering",
      institution: "Vasavi College of Engineering, Hyderabad",
      period: "2021 — 2025",
      result: "CGPA 7.25",
    },
    { qualification: "Intermediate", institution: "TSWR Jr. College, Gowlidoddi, Hyderabad", period: "2021", result: "92.4%" },
    { qualification: "SSC", institution: "TSWRS Chilkoor, Hyderabad", period: "2019", result: "9.0 CGPA" },
  ],

  beyond: [
    { title: "Event organiser", text: "Organised technical events such as “Bid and Code” and volunteered at college technical fests — planning and coordination." },
    { title: "Model United Nations", text: "Active member of the MUN Club — debates, discussions and collaborative work." },
    { title: "Writers Club", text: "Contributor to creative and literary writing activities." },
    { title: "NCC “A” Certificate", text: "National Cadet Corps “A” Certificate · 1st place in an NCC competition." },
  ],
} as const;
