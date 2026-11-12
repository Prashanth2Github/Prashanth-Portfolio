import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  const grid = "rgba(236,232,223,0.06)";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0b0d0c",
          backgroundImage: `linear-gradient(to right, ${grid} 1px, transparent 1px), linear-gradient(to bottom, ${grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          color: "#ece8df",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, color: "#9a9a90" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, background: "#b6f23a" }} />
            <span style={{ color: "#b6f23a" }}>{`// ${profile.role.toUpperCase()}`}</span>
          </div>
          <span>CONTROL PLANE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>PRASHANTH</span>
          <span style={{ display: "flex" }}>
            BONKURU<span style={{ color: "#b6f23a" }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26, color: "#9a9a90" }}>
          <span style={{ maxWidth: 760, color: "#ece8df" }}>Backend systems · identity · workflows · infrastructure</span>
          <span>Go · REST · Temporal · OIDC · SAML</span>
        </div>
      </div>
    ),
    size,
  );
}
