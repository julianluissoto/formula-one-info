"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import type { SessionBests } from "@/lib/openf1";

type Race = { slug: string; gp: string; circuit: string; record: [string, string, number]; sessions: { name: string; at: string }[]; track: ReactNode; tyres: ReactNode };

const tick = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
const HOUR = 3_600_000;
const day = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Argentina/Buenos_Aires" });
const hour = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires" });

export function NextRace({ races, bests = {} }: { races: Race[]; bests?: SessionBests }) {
  // 0 en el servidor: la hora solo se conoce en el navegador.
  const now = useSyncExternalStore(tick, () => Math.floor(Date.now() / 1000), () => 0) * 1000;
  const race = races.find((r) => Date.parse(r.sessions.at(-1)!.at) + 3 * HOUR > now);
  if (!race) return <p className="text-muted">No quedan carreras por delante en el calendario cargado.</p>;

  const start = Date.parse(race.sessions.at(-1)!.at);
  const left = Math.max(0, start - now);
  const parts: [number, string][] = [[Math.floor(left / (24 * HOUR)), "días"], [Math.floor(left / HOUR) % 24, "horas"], [Math.floor(left / 60000) % 60, "min"], [Math.floor(left / 1000) % 60, "seg"]];
  const next = race.sessions.find((s) => Date.parse(s.at) > now);

  return (
    <section aria-labelledby="proxima" className="grid gap-x-10 gap-y-6 rounded-md bg-panel p-5 sm:p-7 md:grid-cols-[1fr_18rem]">
      <div>
        <h3 id="proxima" className="text-3xl font-semibold tracking-tight"><Link href={`/circuitos/${race.slug}`} className="hover:underline">Gran Premio de {race.gp}</Link></h3>
        <p className="mt-1 text-muted">{race.circuit}</p>
        {now > 0 && left === 0 ? <p className="mt-5 text-2xl font-semibold text-signal">En carrera</p> : (
          <div className="mt-5 flex gap-6" role="timer" aria-live="off">
            {parts.map(([n, label]) => (
              <span key={label}><span className="block font-mono text-4xl font-semibold tabular-nums sm:text-5xl">{now ? String(n).padStart(2, "0") : "--"}</span><span className="text-sm text-muted">{label}</span></span>
            ))}
          </div>
        )}
        <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {race.sessions.map((s) => (
            <li key={s.name} className="border-t border-line pt-2">
              <span className={`flex justify-between gap-4 ${now && s === next ? "text-signal" : ""}`}>
                <span>{s.name}</span><time dateTime={s.at} className="tabular-nums">{day.format(new Date(s.at)).replace("-", "/")} {hour.format(new Date(s.at))}</time>
              </span>
              <Best best={bests[s.at]} done={s.at in bests} started={now > 0 && Date.parse(s.at) < now} current={s === race.sessions.findLast((x) => Date.parse(x.at) < now)} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Hora argentina</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-5">{race.track}<p className="text-center"><span className="block text-sm text-muted">Récord de vuelta</span><span className="block font-mono text-2xl font-semibold tabular-nums">{race.record[0]}</span><span className="block text-sm text-muted">{race.record[1]}, {race.record[2]}</span></p>{race.tyres}</div>
    </section>
  );
}

/** Vuelta más rápida de una sesión terminada. */
function Best({ best, done, started, current }: { best?: SessionBests[string]; done: boolean; started: boolean; current: boolean }) {
  if (best) return (
    <span className="mt-1 flex items-baseline justify-between gap-3 text-muted">
      <span className="flex min-w-0 items-center gap-1.5">
        <span aria-hidden className="h-3 w-1 shrink-0" style={{ background: best.color }} />
        <span className="truncate">Más rápido: {best.slug ? <Link href={`/pilotos/${best.slug}`} className="text-ink hover:underline">{best.driver}</Link> : <span className="text-ink">{best.driver}</span>}</span>
      </span>
      <span className="font-mono font-bold text-ink tabular-nums">{best.time}</span>
    </span>
  );
  if (done) return <span className="mt-1 block text-muted">Sin tiempos publicados.</span>;
  if (started) return <span className="mt-1 block text-muted">{current ? "El tiempo más rápido aparece unos minutos después de terminar la sesión." : "Tiempo más rápido todavía no disponible durante una sesión en proceso."}</span>;
  return null;
}
