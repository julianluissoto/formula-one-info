"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type Race = { slug: string; round: number; gp: string; from: string; to: string };

const fmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "America/Argentina/Buenos_Aires" });
const tick = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

export function RaceStrip({ races }: { races: Race[] }) {
  // 0 en el servidor: la hora solo se conoce en el navegador.
  const now = useSyncExternalStore(tick, () => Math.floor(Date.now() / 60_000), () => 0) * 60_000;
  const race = races.find((r) => Date.parse(r.to) + 3 * 3_600_000 > now);
  if (!race) return null;
  return (
    <div className="border-b border-line bg-black">
      <Link href={`/circuitos/${race.slug}`} className="mx-auto flex min-h-11 max-w-6xl items-center gap-3 px-5 text-sm hover:underline">
        <span className="rounded-sm bg-race px-1.5 text-xs leading-5 font-bold">R{race.round}</span>
        <span className="wide font-bold">{race.gp}</span>
        <span className="text-muted">{fmt.format(new Date(race.from))} al {fmt.format(new Date(race.to))}</span>
      </Link>
    </div>
  );
}
