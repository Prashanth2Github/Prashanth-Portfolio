import { profile } from "@/content/profile";

export function SiteFooter() {
  const links = [
    { label: "LinkedIn", href: profile.linkedin },
    ...(profile.github ? [{ label: "GitHub", href: profile.github }] : []),
  ];

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-4 py-8 text-[0.875rem] text-faint md:flex-row md:items-center md:justify-between">
        <p>
          <span className="text-muted">{profile.name}</span> · {profile.role} · {profile.location} · © {new Date().getFullYear()}
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-ink">
              {profile.email}
            </a>
          </li>
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#top" className="transition-colors hover:text-ink">
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
