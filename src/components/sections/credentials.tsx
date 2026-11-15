import { SectionHeading } from "@/components/ui/section-heading";

import { CredentialsGrid } from "./credentials-grid";

export function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <SectionHeading
        id="credentials-title"
        number="05"
        eyebrow="Certifications"
        title="Oracle Cloud certified in generative AI and data science"
        note="Both professional certifications earned in 2025 and valid until 2027, plus NPTEL, Cisco and Infosys programming certificates. Each original is one click away."
      />
      <CredentialsGrid />
    </section>
  );
}
