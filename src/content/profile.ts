export const profile = {
  name: "Prashanth Bonkuru",
  firstName: "Prashanth",
  lastName: "Bonkuru",
  initials: "PB",
  /** Professional identity used for positioning. Current job title is in experience.ts. */
  role: "Software Engineer",
  currentTitle: "Software Engineer",
  company: "Karios",
  location: "Hyderabad, India",
  timezone: "Asia/Kolkata",
  email: "bonkuruprashanth05@gmail.com",
  linkedin: "https://www.linkedin.com/in/prashanth-bonkuru-7a8617265/",
  /** GitHub account linked from Prashanth_Resume3.pdf. Appears in contact, ⌘K, API view and JSON-LD. */
  github: "https://github.com/Prashanth2Github" as string | null,
  resume: "/resume/Prashanth_Bonkuru_Resume.pdf",
  resumeFileName: "Prashanth_Bonkuru_Resume.pdf",

  headline: "Software engineer building Go services, multi-tenant authentication and distributed workflows",
  intro:
    "I build Go services and REST APIs, multi-tenant authentication across LDAP, OIDC and SAML, and distributed workflows with Temporal — and test them end to end, failure paths included.",

  focus: ["Go · REST APIs", "LDAP · OIDC · SAML", "Temporal workflows", "Proxmox · CloudStack", "2× OCI Professional 2025"],

  about: [
    "Computer Science graduate from Vasavi College of Engineering, Hyderabad — and since December 2025, a backend engineer on a cloud infrastructure and virtualization platform at Karios.",
    "My work sits where services, identity and infrastructure meet: APIs that validate before they act, login flows that respect tenant boundaries, and long-running workflows that know what to do when a step fails.",
    "I like the parts that are easy to skip — error handling, event trails, and testing the failure scenario as carefully as the happy path.",
  ],

  principles: [
    { title: "Validate before acting", text: "Check inputs and assumptions early — problems are cheapest to fix before they spread." },
    { title: "Design the failure path", text: "Plan for what can go wrong as carefully as for what should go right." },
    { title: "Leave an event trail", text: "Make behaviour visible, so issues can be understood and fixed quickly." },
  ],

  education: [
    {
      qualification: "B.Tech · Computer Science and Engineering",
      institution: "Vasavi College of Engineering, Hyderabad",
      period: "2021 — 2025",
      result: "CGPA 8.5",
    },
    { qualification: "Intermediate", institution: "TSWR Jr. College, Gowlidoddi, Hyderabad", period: "2021", result: "92.4%" },
    { qualification: "SSC", institution: "TSWRS Chilkoor, Hyderabad", period: "2019", result: "9.0 CGPA" },
  ],

  beyond: [
    {
      title: "Research paper · ICSIE 2025",
      text: "Presented a research paper titled “Smart Timeline Reminders using LSTM” at ICSIE 2025.",
      wide: true,
    },
    { title: "Event organiser", text: "Organised technical events such as “Bid and Code” and volunteered at college technical fests — planning and coordination." },
    { title: "Model United Nations", text: "Active member of the MUN Club — debates, discussions and collaborative work." },
    { title: "Writers Club", text: "Contributor to creative and literary writing activities." },
    { title: "NCC “A” Certificate", text: "National Cadet Corps “A” Certificate · 1st place in an NCC competition." },
  ],
} as const;
