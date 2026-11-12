import type { Role } from "./types";

/**
 * Written from the Karios section of the résumé. Descriptions are generic on purpose:
 * no internal service names, endpoints, customers or architecture details.
 * Source: Prashanth_Resume3.pdf.
 */
export const roles: Role[] = [
  {
    id: "karios",
    company: "Karios",
    title: "Software Engineer",
    location: "Hyderabad, India",
    start: "Dec 2025",
    end: "Present",
    current: true,
    summary:
      "Backend engineering for a cloud infrastructure and virtualization platform — Go services, multi-tenant identity, VM migration workflows, and the testing that keeps them honest.",
    workstreams: [
      {
        id: "ws-backend",
        code: "WS-01",
        title: "Backend services & REST APIs",
        problem:
          "A platform is only as dependable as the APIs in front of it. Every request has to be validated, applied consistently and fail in a predictable way.",
        contribution:
          "Built and maintained backend services and REST APIs in Go, and enhanced the Configuration APIs used to discover, search, filter and resolve configuration values.",
        approach: [
          "Request validation and business logic before any state change",
          "Consistent error handling and database interactions",
          "Service-to-service integration between backend components",
          "Configuration resolved across database and runtime sources, with sensitive-value masking and read-only access",
        ],
        validation:
          "Exercised through API workflows and integration tests. Integration issues were diagnosed from service logs, API behaviour, database records and deployed service binaries.",
        tech: ["Go", "REST APIs", "SQL", "Configuration APIs"],
        simulation: { id: "sim-config", label: "Configuration resolution" },
        source: "resume",
      },
      {
        id: "ws-auth",
        code: "WS-02",
        title: "Multi-tenant authentication",
        problem:
          "Each tenant can bring its own identity provider — and a login must never cross a tenant boundary.",
        contribution:
          "Implemented multi-tenant authentication mechanisms using LDAP, OIDC and SAML, including tenant-specific login and logout processes.",
        approach: [
          "Tenant-specific login and logout flows",
          "Identity-provider integration across LDAP, OIDC and SAML",
          "Just-In-Time (JIT) user provisioning on first sign-in",
        ],
        validation: "Each tenant's login and logout run against its own identity provider, keeping tenant boundaries explicit.",
        tech: ["Go", "LDAP", "Active Directory", "OIDC", "SAML", "Keycloak", "JIT provisioning"],
        simulation: { id: "sim-auth", label: "Authentication flow" },
        source: "resume",
      },
      {
        id: "ws-migration",
        code: "WS-03",
        title: "VM management & migration",
        problem:
          "Moving a virtual machine is a long-running, multi-step operation. Any step can fail or be cancelled, and the system has to stay consistent when it does.",
        contribution:
          "Contributed to virtual machine migration processes — migration operations, source and batch operations, event tracking, cancellation and failure handling — and worked with Temporal for distributed workflow orchestration.",
        approach: [
          "Migration operations, including source and batch operations",
          "Cancellation and failure handling",
          "Event tracking for migration operations",
          "Temporal for distributed workflow orchestration: workflow execution, activity management and failure handling",
        ],
        validation:
          "Integration testing was part of the migration work.",
        tech: ["Go", "Temporal", "Proxmox"],
        simulation: { id: "sim-migration", label: "VM migration workflow" },
        source: "resume",
      },
      {
        id: "ws-events",
        code: "WS-04",
        title: "Events & alerts",
        problem: "Operators can only trust what they can see. Operations that succeed or fail silently leave no trail.",
        contribution:
          "Improved event and alert integration across backend services to track both successful and failed operations.",
        approach: [
          "Event tracking for backend operations",
          "Enhanced event descriptions",
          "Covered both success and failure outcomes",
        ],
        validation: "Event records kept accurate through API interactions and database verification.",
        tech: ["Go", "REST APIs", "SQL"],
        source: "resume",
      },
      {
        id: "ws-infra",
        code: "WS-05",
        title: "Cloud infrastructure & virtualization",
        problem:
          "Platform features ultimately act on real infrastructure — hypervisors, operating systems and virtual-machine lifecycles.",
        contribution:
          "Worked on cloud infrastructure and virtualization: virtual-machine lifecycle operations, resource management and infrastructure integration.",
        approach: [
          "Virtual-machine lifecycle operations",
          "Resource management and infrastructure integration",
          "Proxmox and Apache CloudStack environments",
        ],
        validation: "Infrastructure components covered by integration, end-to-end and performance testing (WS-06).",
        tech: ["Proxmox", "Apache CloudStack", "Linux", "Virtualization"],
        source: "resume",
      },
      {
        id: "ws-testing",
        code: "WS-06",
        title: "Integration & performance testing",
        problem: "Distributed workflows fail in the gaps between services — so that's where testing has to look.",
        contribution:
          "Performed integration, end-to-end and performance testing for APIs and infrastructure components using k6, and evaluated integrating automated performance testing into CI/CD and nightly build pipelines.",
        approach: [
          "Integration and end-to-end testing for APIs and infrastructure components",
          "Verification across API responses, execution results, logs and database records",
          "k6 performance testing: smoke and baseline profiles, load behaviour and p95 response-time thresholds",
          "Evaluated integrating automated performance tests into CI/CD and nightly build pipelines",
        ],
        validation:
          "Backend integration issues diagnosed and resolved through service log analysis, API debugging, database verification and deployed binary checks.",
        tech: ["Integration testing", "End-to-end testing", "API testing", "Performance testing", "k6", "CI/CD"],
        source: "resume",
      },
      {
        id: "ws-delivery",
        code: "WS-07",
        title: "Automation & delivery",
        problem: "Changes to shared backend services need a predictable path from branch to deployment.",
        contribution:
          "Followed Git-based development practices — pull requests, code reviews, refactoring and build validation — to maintain software quality.",
        approach: [
          "Pull requests and code reviews",
          "Refactoring alongside feature work",
          "Build validation",
          "Linux and WSL-based development",
        ],
        validation: "Changes reviewed and build-validated.",
        tech: ["Git", "GitHub", "Linux", "WSL"],
        source: "resume",
      },
    ],
  },
  {
    id: "wyreflow",
    company: "Wyreflow Technologies",
    title: "Tester Intern",
    location: "Bhopal, India",
    start: "Oct 2024",
    end: "Nov 2024",
    current: false,
    summary: "Functional testing in the technical department.",
    workstreams: [],
    highlights: [
      "Functional testing of application behaviour against project requirements and expected outcomes, identifying functional gaps and inconsistencies",
      "Documented and reported software defects",
      "Worked with the development team to reproduce issues, verify fixes and validate application functionality",
    ],
    evidence: { label: "Internship certificate", href: "/certificates/wyreflow-internship.pdf", external: true },
  },
];

export const allWorkstreams = roles.flatMap((role) => role.workstreams);
