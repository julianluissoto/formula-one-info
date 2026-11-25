"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/** Por ronda: [carrera, clasificación, puntos, ¿terminó?]; null si no participó. */
export type CompareDriver = { slug: string; name: string; team: string; color: string; photo: boolean; rounds: ([number, number | null, number, boolean] | null)[] };

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

function stats(d: CompareDriver) {
  const r = d.rounds.filter((x) => x !== null);
  return {
    points: r.reduce((a, x) => a + x[2], 0),
    wins: r.filter((x) => x[0] === 1 && x[3]).length,
    podiums: r.filter((x) => x[0] <= 3 && x[3]).length,
    poles: r.filter((x) => x[1] === 1).length,
    best: Math.min(...r.filter((x) => x[3]).map((x) => x[0])),
    avg: avg(r.filter((x) => x[3]).map((x) => x[0])),
    out: r.filter((x) => !x[3]).length,
  };
}

function duel(a: CompareDriver, b: CompareDriver, k: 0 | 1) {
  let wa = 0, wb = 0;
  a.rounds.forEach((ra, i) => {
    const pa = ra?.[k], pb = b.rounds[i]?.[k];
    if (pa == null || pb == null) return;
    if (pa < pb) wa++;
    else wb++;
  });
  return [wa, wb] as const;
}

export function Compare({ drivers }: { drivers: CompareDriver[] }) {
  const [sel, setSel] = useState([drivers[0].slug, drivers[1].slug]);
  const [a, b] = sel.map((s) => drivers.find((d) => d.slug === s)!);
  const sa = stats(a), sb = stats(b);
  const same = a.slug === b.slug;
  const race = duel(a, b, 0), quali = duel(a, b, 1);
  const fmt = (n: number | null) => (n === null || !Number.isFinite(n) ? "–" : Number.isInteger(n) ? String(n) : n.toLocaleString("es-AR", { maximumFractionDigits: 1 }));
  const rows: [string, number | null, number | null, boolean][] = [
    ["Puntos", sa.points, sb.points, false], ["Victorias", sa.wins, sb.wins, false], ["Podios", sa.podiums, sb.podiums, false], ["Poles", sa.poles, sb.poles, false],
    ["Duelo en clasificación", quali[0], quali[1], false], ["Duelo en carrera", race[0], race[1], false],
    ["Mejor resultado", sa.best, sb.best, true], ["Posición media", sa.avg, sb.avg, true], ["Abandonos o no clasificado", sa.out, sb.out, true],
  ];
  const mate = drivers.find((d) => d.team === a.team && d.slug !== a.slug);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
        {[a, b].map((d, i) => (
          <div key={i} className="min-w-0 rounded-md border-t-4 bg-panel p-4" style={{ borderColor: d.color }}>
            <label className="block text-sm text-muted">Piloto {i + 1}
              <select value={d.slug} onChange={(e) => setSel(i ? [sel[0], e.target.value] : [e.target.value, sel[1]])} className="mt-1 block w-full rounded-md border border-line bg-asphalt px-2 py-2 text-base text-ink">
                {drivers.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </label>
            {d.photo && <Image src={`/pilotos/${d.slug}.jpg`} alt={d.name} width={200} height={240} className="mt-4 aspect-[5/6] w-full max-w-40 rounded-md object-cover object-top" />}
            <p className="mt-3 text-sm text-muted">{d.team}</p>
            <Link href={`/pilotos/${d.slug}`} className="text-sm underline">Ver ficha</Link>
          </div>
        ))}
      </div>
      {mate && mate.slug !== b.slug && <button type="button" onClick={() => setSel([a.slug, mate.slug])} className="mt-4 cursor-pointer text-sm underline">Comparar a {a.name} con su compañero, {mate.name}</button>}
      {same ? <p className="mt-8 rounded-md bg-panel px-4 py-3 text-sm text-muted">Elegí dos pilotos distintos.</p> : (
        <table className="mt-8 w-full overflow-hidden rounded-md bg-panel">
          <caption className="sr-only">{a.name} contra {b.name}</caption>
          <thead className="sr-only"><tr><th>{a.name}</th><th>Dato</th><th>{b.name}</th></tr></thead>
          <tbody>{rows.map(([label, va, vb, lower]) => {
            const win = va === null || vb === null || va === vb ? 0 : (va < vb) === lower ? 1 : 2;
            return (
              <tr key={label} className="border-t border-line first:border-0">
                <td className={`w-1/3 px-4 py-3 text-right font-mono text-2xl tabular-nums ${win === 1 ? "font-semibold text-signal" : "text-muted"}`}>{fmt(va)}</td>
                <th scope="row" className="px-2 py-3 text-center text-sm font-normal text-muted">{label}</th>
                <td className={`w-1/3 px-4 py-3 font-mono text-2xl tabular-nums ${win === 2 ? "font-semibold text-signal" : "text-muted"}`}>{fmt(vb)}</td>
              </tr>
            );
          })}</tbody>
        </table>
      )}
      <p className="mt-3 text-sm text-muted">Los duelos cuentan las rondas en las que participaron los dos.</p>
    </>
  );
}
