"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";

type Race = { slug: string; gp: string; circuit: string; sessions: { name: string; at: string }[]; track: ReactNode; tyres: ReactNode };

const tick = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
const HOUR = 3_600_000;
const day = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Argentina/Buenos_Aires" });
const hour = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires" });

export function NextRace({ races }: { races: Race[] }) {
  // 0 en el servidor: la hora solo se conoce en el navegador.
  const now = useSyncExternalStore(tick, () => Math.floor(Date.now() / 1000), () => 0) * 1000;
  const race = races.find((r) => Date.parse(r.sessions.at(-1)!.at) + 3 * HOUR > now);
  if (!race) return null;

  const start = Date.parse(race.sessions.at(-1)!.at);
  const left = Math.max(0, start - now);
  const parts: [number, string][] = [[Math.floor(left / (24 * HOUR)), "días"], [Math.floor(left / HOUR) % 24, "horas"], [Math.floor(left / 60000) % 60, "min"], [Math.floor(left / 1000) % 60, "seg"]];
  const next = race.sessions.find((s) => Date.parse(s.at) > now);

  return (
    <section aria-labelledby="proxima" className="mt-10 grid gap-x-10 gap-y-6 rounded-md bg-panel p-5 sm:p-7 md:grid-cols-[1fr_18rem]">
      <div>
        <h2 id="proxima" className="text-3xl font-semibold tracking-tight"><Link href={`/circuitos/${race.slug}`} className="hover:underline">Gran Premio de {race.gp}</Link></h2>
        <p className="mt-1 text-muted">Próxima carrera, {race.circuit}</p>
        {now > 0 && left === 0 ? <p className="mt-5 text-2xl font-semibold text-signal">En carrera</p> : (
          <div className="mt-5 flex gap-6" role="timer" aria-live="off">
            {parts.map(([n, label]) => (
              <span key={label}><span className="block font-mono text-4xl font-semibold tabular-nums sm:text-5xl">{now ? String(n).padStart(2, "0") : "--"}</span><span className="text-sm text-muted">{label}</span></span>
            ))}
          </div>
        )}
        <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {race.sessions.map((s) => (
            <li key={s.name} className={`flex justify-between gap-4 border-t border-line pt-2 ${now && s === next ? "text-signal" : ""}`}>
              <span>{s.name}</span><time dateTime={s.at} className="tabular-nums">{day.format(new Date(s.at)).replace("-", "/")} {hour.format(new Date(s.at))}</time>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Hora argentina</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-5">{race.track}{race.tyres}</div>
    </section>
  );
}
