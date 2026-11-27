"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CAR_STRIDE, CHUNK_MS, LOC_STRIDE, type LiveBase, type LiveChunk, type SessionListItem } from "@/lib/live-types";

type Status = "cargando" | "listo" | "bloqueado" | "error";
const SPEEDS = [1, 2, 4, 8];
const LIVE_DELAY = 5000; // en vivo se muestra con unos segundos de atraso para que lleguen los datos

const TYRES: Record<string, [string, string]> = {
  SOFT: ["B", "#ff3b3b"], MEDIUM: ["M", "#ffd23f"], HARD: ["D", "#f1f2f4"], INTERMEDIATE: ["I", "#3ecf6b"], WET: ["L", "#3f86ff"],
};

const lapTime = (s: number | null | undefined) => (s == null ? "–" : `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, "0")}`);
const sec = (s: number | null | undefined) => (s == null ? "–" : s.toFixed(3));
const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
const gapText = (g: number | string | null | undefined) => (g == null ? "" : typeof g === "string" ? g : `+${g.toFixed(3)}`);

/** Último índice i con time(i) <= t, o -1. */
function lastAt(n: number, time: (i: number) => number, t: number) {
  let lo = 0, hi = n - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (time(mid) <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

/** Muestra de telemetría vigente en t (o null si no hay datos cerca). */
function carAt(arr: number[] | undefined, t: number) {
  if (!arr) return null;
  const i = lastAt(arr.length / CAR_STRIDE, (k) => arr[k * CAR_STRIDE], t);
  if (i < 0 || t - arr[i * CAR_STRIDE] > 3000) return null;
  const o = i * CAR_STRIDE;
  return { speed: arr[o + 1] };
}

/** Posición interpolada en t. */
function locAt(arr: number[] | undefined, t: number): [number, number] | null {
  if (!arr) return null;
  const n = arr.length / LOC_STRIDE;
  const i = lastAt(n, (k) => arr[k * LOC_STRIDE], t);
  if (i < 0 || t - arr[i * LOC_STRIDE] > 5000) return null;
  const a = i * LOC_STRIDE;
  if (i + 1 >= n) return [arr[a + 1], arr[a + 2]];
  const b = a + LOC_STRIDE, f = Math.min(1, (t - arr[a]) / (arr[b] - arr[a] || 1));
  return [arr[a + 1] + (arr[b + 1] - arr[a + 1]) * f, arr[a + 2] + (arr[b + 2] - arr[a + 2]) * f];
}

type Flag = { kind: "verde" | "amarilla" | "roja" | "sc" | "vsc" | "final"; text: string };

function trackStatus(control: LiveBase["control"], t: number): Flag {
  let base: Flag = { kind: "verde", text: "Pista libre" };
  let car: Flag | null = null;
  const yellow = new Set<number>();
  for (const [at, category, flag, scope, sector, , message] of control) {
    if (at > t) break;
    if (category === "Flag" && scope === "Track") {
      if (flag === "RED") base = { kind: "roja", text: "Bandera roja" };
      else if (flag === "CHEQUERED") base = { kind: "final", text: "Bandera a cuadros" };
      else if (flag === "GREEN" || flag === "CLEAR") { base = { kind: "verde", text: "Pista libre" }; yellow.clear(); car = null; }
      else if (flag === "YELLOW" || flag === "DOUBLE YELLOW") yellow.add(0);
    } else if (category === "Flag" && scope === "Sector" && sector != null) {
      if (flag === "YELLOW" || flag === "DOUBLE YELLOW") yellow.add(sector);
      else if (flag === "CLEAR" || flag === "GREEN") yellow.delete(sector);
    } else if (category === "SafetyCar") {
      const m = message.toUpperCase();
      if (m.includes("VIRTUAL") && m.includes("DEPLOYED")) car = { kind: "vsc", text: "Auto de seguridad virtual" };
      else if (m.includes("DEPLOYED")) car = { kind: "sc", text: "Auto de seguridad en pista" };
      else if ((m.includes("ENDING") || m.includes("IN THIS LAP")) && car) car = { kind: car.kind, text: `${car.text}: termina en esta vuelta` };
    }
  }
  if (base.kind === "roja" || base.kind === "final") return base;
  if (car) return car;
  if (yellow.size) {
    const sectors = [...yellow].filter((s) => s > 0).sort((a, b) => a - b);
    return { kind: "amarilla", text: sectors.length ? `Bandera amarilla en ${sectors.length === 1 ? "el sector" : "los sectores"} ${sectors.join(", ")}` : "Bandera amarilla" };
  }
  return base;
}

const flagStyle: Record<Flag["kind"], string> = {
  verde: "bg-[#1f7a3d] text-white", amarilla: "bg-[#ffd23f] text-black", roja: "bg-race text-white", sc: "bg-[#ff9d1f] text-black", vsc: "bg-[#ff9d1f] text-black", final: "bg-white text-black [background-image:repeating-conic-gradient(#000_0_25%,#fff_0_50%)] [background-size:16px_16px] [&>*]:bg-white [&>*]:px-2",
};

export function LiveTiming() {
  const [list, setList] = useState<SessionListItem[]>([]);
  const [liveAccess, setLiveAccess] = useState(false);
  const [listError, setListError] = useState<Status | null>(null);
  const [key, setKey] = useState<number | null>(null);
  const [base, setBase] = useState<LiveBase | null>(null);
  const [status, setStatus] = useState<Status>("cargando");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [chunkVersion, setChunkVersion] = useState(0);
  const chunks = useRef(new Map<number, LiveChunk | "cargando" | "error">());

  /** Cambia de sesión y limpia lo cargado de la anterior. */
  const choose = (k: number) => {
    chunks.current.clear();
    setBase(null);
    setStatus("cargando");
    setPlaying(false);
    setKey(k);
  };

  const session = list.find((s) => s.key === key);
  const live = !!session && !session.finished && liveAccess;

  // Lista de sesiones del año.
  useEffect(() => {
    fetch("/api/en-vivo/sesiones")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setList(data.sessions);
        setLiveAccess(data.live);
        const first = (data.sessions as SessionListItem[]).find((s) => s.finished || data.live);
        if (first) setKey(first.key);
      })
      .catch((e) => setListError(e.message === "bloqueado" ? "bloqueado" : "error"));
  }, []);

  // Datos base de la sesión elegida (en vivo se renuevan cada 20 s).
  useEffect(() => {
    if (key == null) return;
    let off = false;
    const load = (first: boolean) =>
      fetch(`/api/en-vivo/${key}`, { cache: "no-store" })
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) throw new Error(data.error);
          if (off) return;
          const b = data as LiveBase;
          setBase(b);
          setStatus("listo");
          if (first) {
            const firstLap = Math.min(...b.laps.map((l) => l[2]).filter(Boolean), b.session.end);
            setT(live ? Date.now() - LIVE_DELAY : Math.max(b.session.start, firstLap - 60_000));
            setPlaying(live);
          }
        })
        .catch((e) => !off && first && setStatus(e.message === "bloqueado" ? "bloqueado" : "error"));
    load(true);
    const timer = live ? setInterval(() => load(false), 20_000) : undefined;
    return () => {
      off = true;
      clearInterval(timer);
    };
  }, [key, live]);

  const chunkIndex = base ? Math.max(0, Math.floor((t - base.session.start) / CHUNK_MS)) : 0;

  const fetchChunk = useCallback((k: number, i: number, force = false) => {
    const cur = chunks.current.get(i);
    if (!force && cur && cur !== "error") return;
    if (!cur) chunks.current.set(i, "cargando");
    fetch(`/api/en-vivo/${k}/${i}`, force ? { cache: "no-store" } : undefined)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        chunks.current.set(i, data);
      })
      .catch(() => chunks.current.get(i) === "cargando" && chunks.current.set(i, "error"))
      .finally(() => setChunkVersion((v) => v + 1));
  }, []);

  // Tramo actual, el anterior (diferencias) y el siguiente (para no frenar la reproducción).
  // Se espera un momento: al arrastrar la barra no se piden los minutos que se saltean.
  useEffect(() => {
    if (!base || key == null) return;
    const timer = setTimeout(() => {
      fetchChunk(key, chunkIndex);
      if (!live) fetchChunk(key, chunkIndex + 1);
      for (const i of chunks.current.keys()) if (i < chunkIndex - 2 || i > chunkIndex + 2) chunks.current.delete(i);
    }, 400);
    return () => clearTimeout(timer);
  }, [base, key, chunkIndex, live, fetchChunk]);

  // En vivo: se vuelve a pedir el tramo actual cada 4 s.
  useEffect(() => {
    if (!live || key == null || !base) return;
    const timer = setInterval(() => fetchChunk(key, Math.floor((Date.now() - LIVE_DELAY - base.session.start) / CHUNK_MS), true), 4000);
    return () => clearInterval(timer);
  }, [live, key, base, fetchChunk]);

  const current = chunks.current.get(chunkIndex);
  const buffering = !!base && typeof current !== "object";

  // Reloj de reproducción.
  useEffect(() => {
    if (!playing || !base) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      if (live) return setT(Date.now() - LIVE_DELAY);
      if (buffering) return;
      setT((x) => {
        const next = x + dt * speed;
        if (next >= base.session.end + 600_000) setPlaying(false);
        return Math.min(next, base.session.end + 600_000);
      });
    }, 150);
    return () => clearInterval(timer);
  }, [playing, base, speed, buffering, live]);

  const view = useMemo(() => {
    if (!base) return null;
    void chunkVersion;
    const isRace = base.session.type === "Race";
    const near = [chunks.current.get(chunkIndex), chunks.current.get(chunkIndex - 1)].filter((c): c is LiveChunk => typeof c === "object");

    // Vueltas y sectores completados hasta t.
    const best: [number, number, number] = [Infinity, Infinity, Infinity];
    let bestLap = Infinity;
    const per = new Map<number, { laps: number; last: number | null; best: number; sectors: (number | null)[]; pbSectors: number[]; lap: number; st: number | null }>();
    for (const d of base.drivers) per.set(d.n, { laps: 0, last: null, best: Infinity, sectors: [null, null, null], pbSectors: [Infinity, Infinity, Infinity], lap: 0, st: null });
    for (const [n, lap, start, dur, s1, s2, s3, st] of base.laps) {
      const p = per.get(n);
      if (!p || start > t) continue;
      p.lap = Math.max(p.lap, lap);
      let end = start;
      [s1, s2, s3].forEach((s, k) => {
        if (s == null) return;
        end += s * 1000;
        if (end > t) return;
        p.sectors[k] = s;
        p.pbSectors[k] = Math.min(p.pbSectors[k], s);
        best[k] = Math.min(best[k], s);
      });
      if (dur != null && start + dur * 1000 <= t) {
        p.laps = Math.max(p.laps, lap);
        p.last = dur;
        p.best = Math.min(p.best, dur);
        bestLap = Math.min(bestLap, dur);
        if (st) p.st = st;
      }
    }

    // Posiciones.
    const pos = new Map<number, number>();
    for (const [at, n, p] of base.positions) {
      if (at > t) break;
      pos.set(n, p);
    }

    // Diferencias (carrera) desde los tramos cargados.
    const gaps = new Map<number, [number | string | null, number | string | null]>();
    for (const c of near.toSorted((a, b) => a.from - b.from)) for (const [at, n, g, i] of c.gaps) if (at <= t) gaps.set(n, [g, i]);

    const rows = base.drivers.map((d) => {
      const p = per.get(d.n)!;
      const stint = base.stints.filter((s) => s[0] === d.n && s[2] <= Math.max(1, p.lap)).at(-1);
      const pitStops = base.pits.filter((x) => x[0] === d.n && x[2] <= t);
      const inPit = pitStops.some((x) => t < x[2] + (x[3] ?? 25) * 1000);
      const car = near.map((c) => carAt(c.car[d.n], t)).find(Boolean) ?? null;
      const gap = isRace ? gaps.get(d.n) : null;
      return {
        d, p, car, inPit,
        pos: pos.get(d.n) ?? 99,
        pits: pitStops.length,
        tyre: stint ? { compound: stint[1], age: stint[4] + Math.max(0, p.lap - stint[2]) } : null,
        gap: isRace ? gapText(gap?.[0]) : p.best < Infinity && p.best > bestLap ? `+${(p.best - bestLap).toFixed(3)}` : "",
        interval: isRace ? gapText(gap?.[1]) : "",
      };
    }).sort((a, b) => a.pos - b.pos || a.d.n - b.d.n);

    const dots = base.drivers.map((d) => ({ d, at: near.map((c) => locAt(c.loc[d.n], t)).find(Boolean) ?? null }));
    const messages = base.control.filter((c) => c[0] <= t).slice(-40).reverse();
    const weather = base.weather[lastAt(base.weather.length, (i) => base.weather[i][0], t)];
    const lap = Math.max(0, ...[...per.values()].map((x) => x.lap));
    return { rows, best, bestLap, dots, messages, weather, flag: trackStatus(base.control, t), lap, isRace };
  }, [base, t, chunkIndex, chunkVersion]);

  if (listError) return <Notice>{listError === "bloqueado" ? "Hay una sesión en vivo y OpenF1 bloquea el acceso gratuito hasta que termine. Volvé en un rato." : "No pudimos conectar con OpenF1. Probá de nuevo en unos minutos."}</Notice>;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted">Sesión
          <select value={key ?? ""} onChange={(e) => choose(Number(e.target.value))} className="max-w-full rounded-md border border-line bg-panel px-3 py-2 text-ink">
            {list.length === 0 && <option>Cargando sesiones…</option>}
            {list.map((s) => (
              <option key={s.key} value={s.key} disabled={!s.finished && !liveAccess}>
                {s.circuit} · {s.name}{!s.finished ? (liveAccess ? " (en vivo)" : " (en curso: disponible al terminar)") : ""}
              </option>
            ))}
          </select>
        </label>
        {base && !live && (
          <>
            <button type="button" onClick={() => setPlaying(!playing)} className="rounded-full bg-race px-5 py-2 font-bold text-white">{playing ? "Pausa" : "Reproducir"}</button>
            <div className="flex gap-1" role="group" aria-label="Velocidad">
              {SPEEDS.map((x) => <button key={x} type="button" aria-pressed={speed === x} onClick={() => setSpeed(x)} className={`rounded-full border px-3 py-2 text-sm ${speed === x ? "border-race bg-race text-white" : "border-line text-muted hover:text-ink"}`}>{x}×</button>)}
            </div>
          </>
        )}
        {live && <span className="flex items-center gap-2 rounded-full bg-race px-4 py-2 text-sm font-bold text-white"><span className="size-2 animate-pulse rounded-full bg-white motion-reduce:animate-none" />EN VIVO</span>}
      </div>

      {status === "bloqueado" && <div className="mt-6"><Notice>Hay una sesión en vivo y OpenF1 bloquea el acceso gratuito hasta que termine. Cuando termine, la repetición queda disponible.</Notice></div>}
      {status === "error" && <div className="mt-6"><Notice>No pudimos traer esta sesión de OpenF1. Probá de nuevo en unos minutos.</Notice></div>}
      {status === "cargando" && key != null && <div className="mt-6 h-96 animate-pulse rounded-md bg-panel motion-reduce:animate-none" aria-label="Cargando sesión" />}

      {base && view && (
        <>
          {!live && (
            <div className="mt-5 flex items-center gap-4">
              <span className="w-20 shrink-0 font-mono text-sm tabular-nums">{clock(t - base.session.start)}</span>
              <input type="range" aria-label="Momento de la sesión" min={base.session.start} max={base.session.end + 600_000} step={1000} value={Math.round(t)} onChange={(e) => setT(Number(e.target.value))} className="w-full accent-race" />
              <span className="w-20 shrink-0 text-right font-mono text-sm text-muted tabular-nums">{clock(base.session.end - base.session.start)}</span>
            </div>
          )}

          <div className={`mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-md px-4 py-3 font-bold ${flagStyle[view.flag.kind]}`} role="status">
            <span>{view.flag.text}</span>
            <span className="text-sm">{base.session.circuit} · {base.session.name}{view.isRace && view.lap > 0 && ` · Vuelta ${view.lap}`}{buffering && " · cargando telemetría…"}</span>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="overflow-x-auto rounded-md bg-panel">
              <table className="w-full text-sm whitespace-nowrap tabular-nums">
                <thead className="text-xs text-muted uppercase">
                  <tr>
                    {["Pos.", "Piloto", view.isRace ? "Líder" : "Dif.", view.isRace ? "Int." : "", "Última", "Mejor", "S1", "S2", "S3", "Neum.", "Boxes", "km/h"].map((h, i) => <th key={i} className={`px-2 py-3 font-bold ${i > 1 ? "text-right" : "text-left"}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {view.rows.map(({ d, p, car, tyre, gap, interval, pits, inPit, pos }) => (
                    <tr key={d.n} className="border-t border-line">
                      <td className="px-2 py-1.5 font-bold">{pos < 99 ? pos : ""}</td>
                      <td className="px-2 py-1.5">
                        <span className="flex items-center gap-2">
                          <span aria-hidden className="h-4 w-1 shrink-0" style={{ background: d.color }} />
                          {d.slug ? <Link href={`/pilotos/${d.slug}`} title={d.name} className="font-bold hover:underline">{d.code}</Link> : <span title={d.name} className="font-bold">{d.code}</span>}
                          {inPit && <span className="rounded-sm bg-line px-1 text-[10px] font-bold">BOXES</span>}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-right">{gap}</td>
                      <td className="px-2 py-1.5 text-right text-muted">{interval}</td>
                      <td className="px-2 py-1.5 text-right">{lapTime(p.last)}</td>
                      <td className={`px-2 py-1.5 text-right ${p.best === view.bestLap ? "font-bold text-[#c77dff]" : ""}`}>{p.best < Infinity ? lapTime(p.best) : "–"}</td>
                      {p.sectors.map((s, k) => (
                        <td key={k} className={`px-2 py-1.5 text-right ${s == null ? "" : s <= view.best[k] ? "font-bold text-[#c77dff]" : s <= p.pbSectors[k] ? "text-[#3ecf6b]" : "text-[#ffd23f]"}`}>{sec(s)}</td>
                      ))}
                      <td className="px-2 py-1.5 text-right">{tyre ? <span className="inline-flex items-center gap-1.5" title={tyre.compound}><span className="grid size-5 place-items-center rounded-full border-2 text-[10px] font-bold" style={{ borderColor: TYRES[tyre.compound]?.[1] ?? "#a3aab6" }}>{TYRES[tyre.compound]?.[0] ?? "?"}</span>{tyre.age}</span> : "–"}</td>
                      <td className="px-2 py-1.5 text-right">{pits}</td>
                      <td className="px-2 py-1.5 text-right font-bold">{car ? car.speed : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              <TrackMap outline={base.outline} dots={view.dots} />
              <div className="rounded-md bg-panel p-4">
                <h2 style={{ fontSize: "0.875rem" }}>Dirección de carrera</h2>
                <ol className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm" aria-live="polite">
                  {view.messages.length === 0 && <li className="text-muted">Sin mensajes todavía.</li>}
                  {view.messages.map(([at, , flag, , , , message, lap]) => (
                    <li key={at + message} className="border-l-2 pl-2" style={{ borderColor: flag === "RED" ? "#e10600" : flag?.includes("YELLOW") ? "#ffd23f" : flag === "GREEN" || flag === "CLEAR" ? "#3ecf6b" : "#3a3a48" }}>
                      <span className="block text-xs text-muted tabular-nums">{clock(at - base.session.start)}{lap ? ` · vuelta ${lap}` : ""}</span>{message}
                    </li>
                  ))}
                </ol>
              </div>
              {view.weather && (
                <dl className="grid grid-cols-3 gap-3 rounded-md bg-panel p-4 text-sm">
                  {[["Aire", `${view.weather[1].toFixed(1)} °C`], ["Pista", `${view.weather[2].toFixed(1)} °C`], ["Humedad", `${Math.round(view.weather[3])}%`], ["Viento", `${(view.weather[5] * 3.6).toFixed(0)} km/h`], ["Lluvia", view.weather[4] ? "Sí" : "No"]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="font-bold tabular-nums">{v}</dd></div>)}
                </dl>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Datos: <a className="underline" href="https://openf1.org">OpenF1</a>. {live ? "En vivo con unos segundos de atraso." : "Repetición de una sesión terminada."} Colores de sectores: violeta, mejor de la sesión; verde, mejor personal; amarillo, más lento.
          </p>
        </>
      )}
    </div>
  );
}

function TrackMap({ outline, dots }: { outline: [number, number][]; dots: { d: LiveBase["drivers"][number]; at: [number, number] | null }[] }) {
  const box = useMemo(() => {
    if (!outline.length) return null;
    const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
    return { x: x0 - pad, y: -(y1 + pad), w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2, path: `M${outline.map(([x, y]) => `${x} ${-y}`).join("L")}Z` };
  }, [outline]);
  if (!box) return <div className="grid aspect-square place-items-center rounded-md bg-panel text-sm text-muted">Sin trazado</div>;
  const r = Math.max(box.w, box.h) / 70;
  return (
    <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} className="aspect-square w-full rounded-md bg-panel" role="img" aria-label="Mapa del circuito con la posición de cada auto">
      <path d={box.path} fill="none" stroke="#3a3a48" strokeWidth={r * 1.6} strokeLinejoin="round" />
      <path d={box.path} fill="none" stroke="#a3aab6" strokeWidth={r * 0.25} strokeLinejoin="round" />
      {dots.map(({ d, at }) => at && (
        <g key={d.n}>
          <circle cx={at[0]} cy={-at[1]} r={r} fill={d.color} stroke="#000" strokeWidth={r * 0.25} />
          <text x={at[0] + r * 1.3} y={-at[1] + r * 0.4} fontSize={r * 1.5} fill="#f1f2f4" fontWeight="700">{d.code}</text>
        </g>
      ))}
    </svg>
  );
}

const Notice = ({ children }: { children: React.ReactNode }) => <p className="rounded-md bg-panel px-4 py-3 text-sm text-muted">{children}</p>;
