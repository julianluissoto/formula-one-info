"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";

// Paleta categórica validada (daltonismo y contraste) sobre el panel oscuro.
const COLORS = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#9085e9"];
const W = 960, H = 460, L = 44, R = 150, T = 16, B = 34;

type Line = { id: string; name: string; cumulative: number[] };

export function PointsChart({ lines, labels }: { lines: Line[]; labels: string[] }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [at, setAt] = useState<number | null>(null);
  const n = labels.length;
  const shown = lines.map((l, i) => ({ ...l, color: COLORS[i] })).filter((l) => !hidden.includes(l.id));
  const max = Math.ceil(Math.max(...lines.map((l) => l.cumulative[n - 1])) / 100) * 100;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);

  // Separa las etiquetas finales para que no se pisen.
  const ends = shown.map((l) => ({ id: l.id, y: y(l.cumulative[n - 1]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 18);
  const endY = (id: string) => ends.find((e) => e.id === id)!.y;

  const move = (e: PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    setAt(Math.max(0, Math.min(n - 1, Math.round(((px - L) / (W - L - R)) * (n - 1)))));
  };
  const key = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!step) return;
    e.preventDefault();
    setAt((v) => Math.max(0, Math.min(n - 1, (v ?? n - 1) + step)));
  };

  return (
    <div className="rounded-md bg-panel p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Pilotos visibles">
        {lines.map((l, i) => {
          const on = !hidden.includes(l.id);
          return (
            <button key={l.id} type="button" aria-pressed={on} onClick={() => setHidden(on ? [...hidden, l.id] : hidden.filter((h) => h !== l.id))} className={`flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm ${on ? "" : "text-muted line-through"}`}>
              <span aria-hidden className="h-0.5 w-4" style={{ background: COLORS[i], opacity: on ? 1 : 0.35 }} />{l.name}
            </button>
          );
        })}
      </div>
      <div className="overflow-x-auto">
        <div className="relative min-w-[640px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full touch-pan-x" role="img" aria-label="Puntos acumulados por carrera. Los valores están en la tabla de abajo." tabIndex={0} onPointerMove={move} onPointerLeave={() => setAt(null)} onKeyDown={key} onBlur={() => setAt(null)}>
            {Array.from({ length: max / 100 + 1 }, (_, i) => i * 100).map((v) => (
              <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--color-line)" /><text x={L - 8} y={y(v)} dy="0.35em" textAnchor="end" fontSize="12" fill="var(--color-muted)">{v}</text></g>
            ))}
            {labels.map((_, i) => (i % 2 === 0 || i === n - 1) && <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--color-muted)">{i + 1}</text>)}
            {at !== null && <line x1={x(at)} x2={x(at)} y1={T} y2={H - B} stroke="var(--color-muted)" />}
            {shown.map((l) => {
              const last = y(l.cumulative[n - 1]);
              return (
                <g key={l.id}>
                  <path d={"M" + l.cumulative.map((v, i) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("L")} fill="none" stroke={l.color} strokeWidth="2" strokeLinejoin="round" />
                  <circle cx={x(at ?? n - 1)} cy={y(l.cumulative[at ?? n - 1])} r="4.5" fill={l.color} stroke="var(--color-panel)" strokeWidth="2" />
                  <path d={`M${x(n - 1) + 7} ${last}L${x(n - 1) + 18} ${endY(l.id)}`} stroke="var(--color-muted)" strokeWidth="1" />
                  <text x={x(n - 1) + 22} y={endY(l.id)} dy="0.35em" fontSize="13" fill="var(--color-ink)">{l.name.split(" ").slice(1).join(" ")} {l.cumulative[n - 1]}</text>
                </g>
              );
            })}
          </svg>
          {at !== null && (
            <div className="pointer-events-none absolute top-2 rounded-md border border-line bg-asphalt px-3 py-2 text-sm" style={at > n / 2 ? { right: `${100 - (x(at) / W) * 100 + 1.5}%` } : { left: `${(x(at) / W) * 100 + 1.5}%` }}>
              <p className="mb-1 font-medium">{at + 1}. {labels[at]}</p>
              {[...shown].sort((a, b) => b.cumulative[at] - a.cumulative[at]).map((l) => (
                <p key={l.id} className="flex items-center gap-2 whitespace-nowrap"><span aria-hidden className="h-0.5 w-3" style={{ background: l.color }} /><span className="font-semibold tabular-nums">{l.cumulative[at]}</span><span className="text-muted">{l.name}</span></p>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">Puntos acumulados tras cada ronda, sprints incluidos.</p>
    </div>
  );
}
