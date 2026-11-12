import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="label flex items-center gap-2 text-fail">
        <span className="status-dot" aria-hidden="true" /> 404 · route not found
      </p>
      <h1 className="display mt-4 text-[clamp(3rem,10vw,8rem)] leading-[0.9] font-bold">
        No handler
        <br />
        <span className="text-muted">for this path.</span>
      </h1>
      <div className="mt-10">
        <Link href="/" className="btn btn-primary">
          Return to index
        </Link>
      </div>
    </main>
  );
}
