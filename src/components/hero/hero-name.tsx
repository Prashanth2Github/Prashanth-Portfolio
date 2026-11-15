import { profile } from "@/content/profile";

/** The name is the headline: large, medium weight, tight display tracking. */
export function HeroName() {
  return (
    <h1
      className="display mt-6 text-[clamp(2.75rem,7vw,5rem)] leading-[1.02] tracking-[-0.035em]"
    >
      {profile.name}
    </h1>
  );
}
