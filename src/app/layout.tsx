import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { LazyCommandPalette } from "@/components/layout/lazy-command-palette";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import { credentials } from "@/content/credentials";
import { profile } from "@/content/profile";
import { seo, siteUrl } from "@/content/site";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s — ${profile.name}` },
  description: seo.description,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  keywords: [
    "Prashanth Bonkuru",
    "Software Engineer",
    "Backend Engineer",
    "Go",
    "Golang",
    "REST APIs",
    "Temporal",
    "OIDC",
    "SAML",
    "LDAP",
    "Cloud infrastructure",
    "Virtualization",
    "Hyderabad",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: seo.title,
    description: seo.description,
    firstName: profile.firstName,
    lastName: profile.lastName,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: profile.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Vasavi College of Engineering" },
  sameAs: [profile.linkedin, ...(profile.github ? [profile.github] : [])],
  knowsAbout: ["Go", "REST APIs", "Temporal", "LDAP", "OIDC", "SAML", "Virtualization", "Cloud infrastructure", "Integration testing"],
  hasCredential: credentials
    .filter((c) => c.featured)
    .map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.title, recognizedBy: { "@type": "Organization", name: "Oracle" } })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrains.variable}`}>
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <LazyCommandPalette />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
