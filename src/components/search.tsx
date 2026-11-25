"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { href: string; name: string; detail: string; kind: "Pilotos" | "Escuderías" | "Circuitos" };
const kinds = ["Todo", "Pilotos", "Escuderías", "Circuitos"] as const;
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Search({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("Todo");
  const words = norm(q).split(/\s+/).filter(Boolean);
  const found = items.filter((x) => (kind === "Todo" || x.kind === kind) && words.every((w) => norm(`${x.name} ${x.detail}`).includes(w)));

  return (
    <>
      <label className="mt-8 block">
        <span className="sr-only">Buscar</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre, número, país o escudería" className="w-full rounded-md border border-line bg-panel px-4 py-3 text-lg placeholder:text-muted" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
        {kinds.map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${kind === k ? "border-race bg-race text-white" : "border-line text-muted hover:text-ink"}`}>{k}</button>)}
      </div>
      <p className="mt-6 text-sm text-muted" role="status">{found.length === 0 ? "Sin resultados. Probá con otra palabra o filtro." : `${found.length} ${found.length === 1 ? "resultado" : "resultados"}`}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {found.map((x) => (
          <li key={x.href}><Link href={x.href} className="block h-full rounded-md bg-panel px-4 py-3 transition-colors hover:bg-panel-hover"><span className="block font-medium">{x.name}</span><span className="block text-sm text-muted">{x.detail}</span></Link></li>
        ))}
      </ul>
    </>
  );
}
