import { LocalTime } from "@/components/hero/local-time";
import { profile } from "@/content/profile";

const buildDate = new Date().toISOString().slice(0, 10);

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="wrap flex flex-col gap-3 py-5 font-mono text-[0.75rem] tracking-[0.04em] text-faint uppercase md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2.5 text-ink">
          <span className="status-dot text-signal" data-live aria-hidden="true" />
          All systems nominal
          <span className="text-faint">· Hyderabad <LocalTime timeZone={profile.timezone} /></span>
        </p>
        <p>
          Build {buildDate} · Next.js · TypeScript · Motion
        </p>
        <p className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#top" className="text-ink hover:text-signal">
            Top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
