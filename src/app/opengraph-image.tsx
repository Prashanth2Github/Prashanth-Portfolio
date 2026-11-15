import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Same direction as the site: graphite ground, one square state marker, plain type. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0c0d0d",
          color: "#ecebe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#ecebe6" }}>
          <div style={{ width: 14, height: 14, borderRadius: 2, background: "#a3d65f" }} />
          <span>{`${profile.currentTitle} at ${profile.company}`}</span>
          <span style={{ color: "#85857f" }}>· Hyderabad</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ fontSize: 104, fontWeight: 500, lineHeight: 1, letterSpacing: -4 }}>{profile.name}</span>
          <span style={{ maxWidth: 940, fontSize: 34, lineHeight: 1.35, color: "#a6a69f" }}>
            Go services, multi-tenant authentication across LDAP, OIDC and SAML, and distributed workflows with Temporal
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#85857f" }}>
          <span>Backend · identity · workflows · infrastructure</span>
          <span>2× Oracle Cloud Professional 2025</span>
        </div>
      </div>
    ),
    size,
  );
}
