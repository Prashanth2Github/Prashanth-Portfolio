"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useApp } from "@/components/providers";
import { ArrowUpRight, Close, Copy, Download } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { credentials } from "@/content/credentials";
import type { Credential } from "@/content/types";
import { copyText } from "@/lib/utils";

function Viewer({ cred, onClose }: { cred: Credential | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (cred && !d.open) d.showModal();
    if (!cred && d.open) d.close();
  }, [cred]);

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-labelledby="viewer-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {cred ? (
        <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line p-4 sm:p-5">
            <div>
              <p className="label text-faint">{cred.issuer}</p>
              <h3 id="viewer-title" className="display mt-1 text-[1.25rem] leading-tight font-semibold sm:text-[1.5rem]">
                {cred.title}
              </h3>
            </div>
            <button type="button" onClick={onClose} className="flex size-10 shrink-0 items-center justify-center border border-line hover:border-ink" aria-label="Close certificate">
              <Close size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-[#090b0a] p-3 sm:p-5">
            <Image
              src={cred.image}
              alt={`Certificate: ${cred.title}, issued by ${cred.issuer}`}
              width={cred.width}
              height={cred.height}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="mx-auto h-auto w-full max-w-[60rem]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-line p-4">
            <p className="label mr-auto text-faint">
              {cred.issued}
              {cred.validUntil ? ` · valid until ${cred.validUntil}` : ""}
            </p>
            {cred.verifyUrl ? (
              <a className="btn btn-sm" href={cred.verifyUrl} target="_blank" rel="noreferrer">
                Verify <ArrowUpRight size={14} className="btn-arrow" />
              </a>
            ) : null}
            <a className="btn btn-sm" href={cred.pdf} target="_blank" rel="noopener">
              Open PDF <ArrowUpRight size={14} className="btn-arrow" />
            </a>
            <a className="btn btn-primary btn-sm" href={cred.pdf} download>
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

export function CredentialsGrid() {
  const [open, setOpen] = useState<Credential | null>(null);
  const { notify } = useApp();
  const featured = credentials.filter((c) => c.featured);
  const others = credentials.filter((c) => !c.featured);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {featured.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08} as="article">
            <div id={`cred-${c.id}`} className="pane brackets group scroll-mt-28">
              <button type="button" onClick={() => setOpen(c)} className="relative block w-full overflow-hidden border-b border-line bg-[#090b0a]" aria-label={`View certificate: ${c.title}`}>
                <Image
                  src={c.thumb}
                  alt=""
                  width={720}
                  height={556}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-auto w-full opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:opacity-100"
                />
                <span className="label absolute top-3 left-3 flex items-center gap-2 bg-bg/90 px-2 py-1 text-signal">
                  <span className="status-dot" aria-hidden="true" /> Valid until {c.validUntil}
                </span>
              </button>
              <div className="p-5 md:p-6">
                <p className="label text-faint">{c.issuer} · Professional</p>
                <h3 className="display mt-2 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.08] font-semibold">{c.title}</h3>
                <dl className="mt-5 grid grid-cols-2 gap-px border border-line bg-line font-mono text-[0.8125rem]">
                  <div className="bg-bg p-3">
                    <dt className="label text-faint">Issued</dt>
                    <dd className="mt-0.5 text-ink">{c.issued}</dd>
                  </div>
                  <div className="bg-bg p-3">
                    <dt className="label text-faint">Valid until</dt>
                    <dd className="mt-0.5 text-ink">{c.validUntil}</dd>
                  </div>
                  <div className="col-span-2 bg-bg p-3">
                    <dt className="label text-faint">Credential ID</dt>
                    <dd className="mt-0.5 flex items-center justify-between gap-3 text-ink">
                      <span className="truncate">{c.credentialId}</span>
                      <button
                      type="button"
                      className="flex size-9 shrink-0 items-center justify-center border border-line text-muted hover:border-signal hover:text-signal"
                      aria-label="Copy credential ID"
                      onClick={async () => notify((await copyText(c.credentialId!)) ? "Credential ID copied" : c.credentialId!)}
                    >
                        <Copy size={14} />
                      </button>
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(c)}>
                    View certificate
                  </button>
                  <a className="btn btn-sm" href={c.pdf} target="_blank" rel="noopener">
                    PDF <ArrowUpRight size={14} className="btn-arrow" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <p className="label mb-3 text-faint">Further certifications</p>
        <ul className="border-t border-line">
          {others.map((c, i) => (
            <li key={c.id} id={`cred-${c.id}`} className="scroll-mt-28 border-b border-line">
              <div className="grid gap-3 py-5 md:grid-cols-[3rem_1.5fr_1fr_auto] md:items-center md:gap-6">
                <span className="label text-signal">0{i + 3}</span>
                <div>
                  <p className="label text-faint">{c.issuer}</p>
                  <p className="display mt-1 text-[1.25rem] leading-tight font-semibold">{c.title}</p>
                </div>
                <p className="font-mono text-[0.8125rem] text-muted">
                  {c.issued}
                  {c.note ? <span className="block text-signal">{c.note}</span> : null}
                  {c.credentialId ? (
                    <span className="block text-faint">
                      {c.credentialIdLabel ?? "ID"} {c.credentialId}
                    </span>
                  ) : null}
                </p>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-sm" onClick={() => setOpen(c)}>
                    View
                  </button>
                  <a className="btn btn-sm" href={c.pdf} target="_blank" rel="noopener" aria-label={`Open ${c.title} PDF`}>
                    PDF <ArrowUpRight size={14} className="btn-arrow" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="label mt-4 text-faint">Details transcribed from the original certificates · originals available as PDF</p>
      </Reveal>

      <Viewer cred={open} onClose={() => setOpen(null)} />
    </>
  );
}
