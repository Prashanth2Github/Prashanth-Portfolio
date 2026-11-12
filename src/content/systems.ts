/**
 * Data for the interactive simulations. These are conceptual models built from public,
 * standard concepts (REST, Temporal-style workflows, LDAP/OIDC/SAML, layered config).
 * They do not describe Karios's internal architecture, services or endpoints.
 */

export type MapNodeId = "api" | "identity" | "workflow" | "infrastructure" | "data";

export const mapNodes: {
  id: MapNodeId;
  label: string;
  title: string;
  summary: string;
  tech: string[];
  workstreams: string[];
  x: number; // viewBox 0–100
  y: number; // viewBox 0–75
}[] = [
  {
    id: "api",
    label: "API",
    title: "API layer",
    summary: "Go services and REST APIs that validate every request, apply business logic and fail predictably.",
    tech: ["Go", "REST", "Validation", "Error handling"],
    workstreams: ["ws-backend", "ws-events"],
    x: 16,
    y: 38,
  },
  {
    id: "identity",
    label: "Identity",
    title: "Identity & authentication",
    summary: "Tenant-aware login and logout across LDAP, OIDC and SAML providers, with Just-In-Time provisioning.",
    tech: ["LDAP", "OIDC", "SAML", "Keycloak", "JIT"],
    workstreams: ["ws-auth"],
    x: 48,
    y: 11,
  },
  {
    id: "workflow",
    label: "Workflow",
    title: "Workflow engine",
    summary: "Long-running, durable operations — like VM migration — with cancellation and explicit failure paths.",
    tech: ["Temporal", "Retries", "Cancellation", "Compensation"],
    workstreams: ["ws-migration", "ws-testing"],
    x: 84,
    y: 30,
  },
  {
    id: "infrastructure",
    label: "Infra",
    title: "Infrastructure",
    summary: "Virtual-machine lifecycle operations and resource management on Proxmox and Apache CloudStack environments.",
    tech: ["Proxmox", "Apache CloudStack", "Linux", "VMs"],
    workstreams: ["ws-infra", "ws-migration"],
    x: 70,
    y: 64,
  },
  {
    id: "data",
    label: "Data",
    title: "Data, config & events",
    summary: "Database-backed configuration with masking and read-only access, plus event records for every outcome.",
    tech: ["SQL", "Config", "Events", "Alerts"],
    workstreams: ["ws-backend", "ws-events"],
    x: 28,
    y: 64,
  },
];

export const mapEdges: { from: MapNodeId; to: MapNodeId; label: string }[] = [
  { from: "api", to: "identity", label: "authn" },
  { from: "api", to: "workflow", label: "start workflow" },
  { from: "api", to: "data", label: "query · config" },
  { from: "workflow", to: "infrastructure", label: "VM operations" },
  { from: "workflow", to: "data", label: "events" },
  { from: "identity", to: "data", label: "JIT provision" },
  { from: "infrastructure", to: "data", label: "state" },
];

/* ---------------------------------------------------------------- migration */

export const migrationStages = [
  { id: "validate", label: "Validate", detail: "Check source, target and capacity before anything moves." },
  { id: "snapshot", label: "Snapshot", detail: "Capture a consistent point-in-time state." },
  { id: "transfer", label: "Transfer", detail: "Copy disks and configuration to the target." },
  { id: "verify", label: "Verify", detail: "Confirm the target matches before switching." },
  { id: "cutover", label: "Cutover", detail: "Switch over and record the outcome." },
] as const;

export const compensationStages = [
  { id: "compensate", label: "Compensate", detail: "Undo completed steps in reverse order." },
  { id: "rollback", label: "Rolled back", detail: "Source VM keeps running, unchanged." },
] as const;

/* --------------------------------------------------------------------- auth */

export const authLanes = [
  { id: "client", label: "Client" },
  { id: "tenant", label: "Tenant" },
  { id: "idp", label: "IdP" },
  { id: "auth", label: "Auth" },
  { id: "session", label: "Session" },
] as const;

export type AuthLane = (typeof authLanes)[number]["id"];
export type AuthProtocol = "oidc" | "saml" | "ldap";

export const authFlows: Record<
  AuthProtocol,
  { label: string; tagline: string; steps: { from: AuthLane; to: AuthLane; label: string; status: string }[] }
> = {
  oidc: {
    label: "OIDC",
    tagline: "OpenID Connect — token-based, built on the OAuth 2.0 authorization-code flow.",
    steps: [
      { from: "client", to: "tenant", label: "Sign in to tenant-a", status: "resolve tenant" },
      { from: "tenant", to: "client", label: "Redirect to the tenant's OIDC provider", status: "302" },
      { from: "client", to: "idp", label: "Authorization request · user authenticates", status: "authenticating" },
      { from: "idp", to: "auth", label: "Authorization code exchanged for ID token", status: "token issued" },
      { from: "auth", to: "auth", label: "Validate token · JIT-provision user", status: "provisioned" },
      { from: "auth", to: "session", label: "Issue tenant-scoped session", status: "session ✓" },
    ],
  },
  saml: {
    label: "SAML",
    tagline: "SAML 2.0 — signed XML assertions delivered through the browser.",
    steps: [
      { from: "client", to: "tenant", label: "Sign in to tenant-b", status: "resolve tenant" },
      { from: "tenant", to: "client", label: "AuthnRequest · redirect to the tenant's SAML IdP", status: "302" },
      { from: "client", to: "idp", label: "User authenticates at the IdP", status: "authenticating" },
      { from: "idp", to: "auth", label: "Signed assertion posted to the service (ACS)", status: "assertion" },
      { from: "auth", to: "auth", label: "Verify signature · map attributes · JIT-provision", status: "provisioned" },
      { from: "auth", to: "session", label: "Issue tenant-scoped session", status: "session ✓" },
    ],
  },
  ldap: {
    label: "LDAP",
    tagline: "LDAP / Active Directory — credentials verified by a directory bind.",
    steps: [
      { from: "client", to: "tenant", label: "Credentials submitted for tenant-c", status: "resolve tenant" },
      { from: "tenant", to: "auth", label: "Look up the tenant's directory configuration", status: "config" },
      { from: "auth", to: "idp", label: "Bind and search against LDAP / AD", status: "bind" },
      { from: "idp", to: "auth", label: "Bind result and group membership", status: "bind ok" },
      { from: "auth", to: "auth", label: "Map groups · JIT-provision user", status: "provisioned" },
      { from: "auth", to: "session", label: "Issue tenant-scoped session", status: "session ✓" },
    ],
  },
};

/* ------------------------------------------------------------------- config */

export type ConfigSourceId = "defaults" | "database" | "runtime";

export const configSources: { id: ConfigSourceId; label: string; priority: number; note: string }[] = [
  { id: "defaults", label: "Defaults", priority: 1, note: "Shipped with the service" },
  { id: "database", label: "Database", priority: 2, note: "Per-environment overrides" },
  { id: "runtime", label: "Runtime", priority: 3, note: "Environment & flags" },
];

export const configEntries: { key: string; secret?: boolean; values: Partial<Record<ConfigSourceId, string>> }[] = [
  { key: "api.request_timeout", values: { defaults: "30s", database: "45s" } },
  { key: "log.level", values: { defaults: "info", runtime: "debug" } },
  { key: "migration.max_parallel", values: { defaults: "2", database: "4" } },
  { key: "events.retention_days", values: { defaults: "30" } },
  { key: "auth.session_ttl", values: { defaults: "8h", database: "12h", runtime: "1h" } },
  { key: "idp.client_secret", secret: true, values: { database: "x" } },
  { key: "ldap.bind_password", secret: true, values: { runtime: "x" } },
];
