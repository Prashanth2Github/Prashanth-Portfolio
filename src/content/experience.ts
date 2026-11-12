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
          "Implemented multi-tenant authentication workflows using LDAP, OIDC and SAML, including tenant-specific login and logout flows.",
        approach: [
          "Tenant-specific login and logout flows",
          "Identity-provider integration across LDAP, OIDC and SAML",
          "Just-In-Time (JIT) user provisioning on first sign-in",
        ],
        validation: "Flows exercised end to end for each identity-provider type, including JIT provisioning.",
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
          "Engineered VM migration workflows using Temporal — migration operations, source and batch operations, cancellation workflows and failure handling.",
        approach: [
          "Durable multi-step workflows orchestrated with Temporal",
          "Source and batch migration operations",
          "Cancellation workflows and explicit failure handling",
          "Event tracking at each stage of a migration",
        ],
        validation:
          "Integration tests covering successful and failure scenarios, verified through workflow execution, API responses, logs, database records and event data.",
        tech: ["Go", "Temporal", "Proxmox", "FreeBSD"],
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
          "Added missing event tracking to backend operations",
          "Improved user-facing event descriptions",
          "Covered both success and failure outcomes",
        ],
        validation: "Event records validated through API workflows and database verification.",
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
          "Supported cloud infrastructure and virtualization workflows: virtual-machine lifecycle operations and infrastructure management.",
        approach: [
          "Virtual-machine lifecycle operations",
          "Infrastructure management across Proxmox, Apache CloudStack and FreeBSD-based environments",
          "Deploying services and validating features across infrastructure environments",
        ],
        validation: "End-to-end validation across infrastructure environments during deployment and feature validation.",
        tech: ["Proxmox", "Apache CloudStack", "FreeBSD", "Linux", "Virtualization"],
        source: "resume",
      },
      {
        id: "ws-testing",
        code: "WS-06",
        title: "Integration & performance testing",
        problem: "Distributed workflows fail in the gaps between services — so that's where testing has to look.",
        contribution:
          "Performed integration, end-to-end and performance testing for infrastructure and migration workflows, using k6 for performance testing.",
        approach: [
          "Success and failure scenarios, not only the happy path",
          "Verification across API responses, workflow execution, logs, database records and event data",
          "Performance testing with k6: smoke and baseline profiles, load testing and p95 response-time thresholds",
        ],
        validation:
          "Issues found during deployment and feature validation were diagnosed and resolved by analysing logs, API behaviour, database records and deployed binaries.",
        tech: ["Integration testing", "End-to-end testing", "API testing", "Performance testing", "k6"],
        source: "resume",
      },
      {
        id: "ws-delivery",
        code: "WS-07",
        title: "Automation & delivery",
        problem: "Changes to shared backend services need a predictable path from branch to deployment.",
        contribution:
          "Followed Git-based development practices — pull requests, code reviews, refactoring and build validation — and analysed CI/CD integration approaches for automated performance tests in a Jenkins nightly build pipeline.",
        approach: [
          "Pull requests and code reviews",
          "Refactoring alongside feature work",
          "Build validation before changes ship",
          "Evaluated running automated performance tests in the Jenkins nightly build",
          "Linux and WSL-based development",
        ],
        validation: "Changes reviewed and build-validated before deployment.",
        tech: ["Git", "GitHub", "Jenkins", "CI/CD", "Linux", "WSL"],
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
    summary: "Functional and software testing in the technical department.",
    workstreams: [],
    highlights: [
      "Validated application behaviour against project requirements through functional testing",
      "Identified and reported application issues affecting functionality and reliability",
      "Worked with the technical team to execute assigned testing activities",
    ],
    evidence: { label: "Internship certificate", href: "/certificates/wyreflow-internship.pdf", external: true },
  },
];

export const allWorkstreams = roles.flatMap((role) => role.workstreams);
