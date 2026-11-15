import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label flex items-center gap-2">
        <span className="state text-fail" aria-hidden="true" /> 404
      </p>
      <h1 className="display mt-4 max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.035em]">
        There’s no page at this address
      </h1>
      <p className="mt-5 max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted">
        The link may be out of date. Everything on this site lives on the home page.
      </p>
      <div className="mt-10">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
