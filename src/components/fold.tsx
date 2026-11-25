"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// Recuerda en el navegador qué secciones dejó abiertas cada persona.
const KEY = "secciones";
const EVENT = "secciones-cambio";
let memory = "{}";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

function read() {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function parse(raw: string): Record<string, boolean> {
  try {
    return JSON.parse(raw) ?? {};
  } catch {
    return {};
  }
}

function save(id: string, open: boolean) {
  memory = JSON.stringify({ ...parse(read()), [id]: open });
  try {
    localStorage.setItem(KEY, memory);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function Fold({ id, title, aside, defaultOpen = false, children }: { id: string; title: string; aside?: ReactNode; defaultOpen?: boolean; children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  const open = parse(raw)[id] ?? defaultOpen;

  return (
    <details open={open} onToggle={(e) => e.target === e.currentTarget && e.currentTarget.open !== open && save(id, e.currentTarget.open)} className="group/fold border-t border-line last:border-b">
      <summary className="flex cursor-pointer list-none items-center gap-4 py-5 hover:text-signal [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
          <span role="heading" aria-level={2} className="block text-2xl font-semibold tracking-tight">{title}</span>
          {aside && <span className="block text-sm text-muted">{aside}</span>}
        </span>
        <svg viewBox="0 0 20 20" aria-hidden className="size-5 shrink-0 transition-transform group-open/fold:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l6 6 6-6" /></svg>
      </summary>
      <div className="pb-8">{children}</div>
    </details>
  );
}
