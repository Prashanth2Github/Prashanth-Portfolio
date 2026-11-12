"use client";

import { m } from "motion/react";
import { Fragment, useMemo, type ReactNode } from "react";

import { useApp } from "@/components/providers";
import { ArrowUpRight, Copy } from "@/components/ui/icons";
import { buildApiPayload } from "@/lib/api-payload";
import { copyText } from "@/lib/utils";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function Value({ value, indent }: { value: Json; indent: number }): ReactNode {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);
  if (value === null) return <span className="text-fail">null</span>;
  if (typeof value === "string") {
    const isUrl = /^(https?:|mailto:)/.test(value);
    return isUrl ? (
      <a href={value} target={value.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-info underline decoration-line-strong underline-offset-4 hover:decoration-info">
        &quot;{value}&quot;
      </a>
    ) : (
      <span className="text-[#d9e8b0]">&quot;{value}&quot;</span>
    );
  }
  if (typeof value === "number" || typeof value === "boolean") return <span className="text-run">{String(value)}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return <span>[]</span>;
    const inline = value.every((v) => typeof v === "string") && value.join("").length < 60;
    if (inline)
      return (
        <span>
          [
          {value.map((v, i) => (
            <Fragment key={i}>
              <Value value={v} indent={indent} />
              {i < value.length - 1 ? ", " : ""}
            </Fragment>
          ))}
          ]
        </span>
      );
    return (
      <span>
        [{"\n"}
        {value.map((v, i) => (
          <Fragment key={i}>
            {padInner}
            <Value value={v} indent={indent + 1} />
            {i < value.length - 1 ? "," : ""}
            {"\n"}
          </Fragment>
        ))}
        {pad}]
      </span>
    );
  }
  const entries = Object.entries(value);
  return (
    <span>
      {"{"}
      {"\n"}
      {entries.map(([k, v], i) => (
        <Fragment key={k}>
          {padInner}
          <span className="text-signal">&quot;{k}&quot;</span>
          <span className="text-faint">: </span>
          <Value value={v} indent={indent + 1} />
          {i < entries.length - 1 ? "," : ""}
          {"\n"}
        </Fragment>
      ))}
      {pad}
      {"}"}
    </span>
  );
}

export function ApiView() {
  const { setView, notify } = useApp();
  const payload = useMemo(() => buildApiPayload(), []);
  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);
  const bytes = useMemo(() => new TextEncoder().encode(json).length, [json]);

  return (
    <section className="wrap pt-[calc(var(--header-h)+3rem)] pb-24" aria-label="API view of this portfolio">
      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <p className="label mb-4">
          <span className="text-signal">{"// "}API VIEW</span> — the same portfolio, as a response. The endpoint is real.
        </p>
        <div className="pane">
          <div className="pane-head flex-wrap">
            <p className="font-mono text-[0.875rem]">
              <span className="mr-3 bg-signal px-1.5 py-0.5 text-bg">GET</span>
              /v1/engineer/prashanth
            </p>
            <p className="label flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-2 text-signal">
                <span className="status-dot" aria-hidden="true" /> 200 OK
              </span>
              <span>application/json</span>
              <span>{(bytes / 1024).toFixed(1)} KB</span>
            </p>
          </div>
          <pre className="max-h-[70vh] overflow-auto p-5 font-mono text-[0.8125rem] leading-[1.75] text-ink sm:p-6 sm:text-[0.875rem]" tabIndex={0} aria-label="JSON response">
            <code>
              <Value value={payload as Json} indent={0} />
            </code>
          </pre>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => setView("human")}>
            Back to human view
          </button>
          <button type="button" className="btn" onClick={async () => notify((await copyText(json)) ? "JSON copied" : "Copy failed")}>
            <Copy size={15} /> Copy JSON
          </button>
          <a className="btn" href="/v1/engineer/prashanth" target="_blank" rel="noopener">
            Open raw endpoint <ArrowUpRight size={15} className="btn-arrow" />
          </a>
        </div>
      </m.div>
    </section>
  );
}
