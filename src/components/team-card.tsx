import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { DriverPhoto } from "@/components/driver-photo";
import { FavStar } from "@/components/favorite";
import { DriverName, TeamBadge } from "@/components/ui";
import { suplentes, titulares } from "@/data/drivers";
import type { Team } from "@/data/types";

// Red Bull y Racing Bulls no tienen logo libre en Commons: se muestra el nombre.
const logos: Record<string, string> = {
  mercedes: "svg", ferrari: "svg", mclaren: "png", alpine: "svg", haas: "svg",
  audi: "svg", williams: "svg", "aston-martin": "svg", cadillac: "png",
};

export function TeamCard({ team }: { team: Team }) {
  const main = titulares.filter((x) => x.teams.includes(team.slug));
  const subs = suplentes.filter((x) => x.teams.includes(team.slug));
  const ext = logos[team.slug];

  return (
    <section className="flex flex-col overflow-hidden rounded-md border-t-4 bg-panel" style={{ borderColor: team.color }}>
      <h3 className="px-4 pt-3 pb-2 wide text-lg font-bold"><TeamBadge team={team} /><FavStar href={`/escuderias/${team.slug}`} /></h3>
      <div className="grid grid-cols-2 divide-x divide-line border-y border-line">
        {main.map((x) => (
          <Link key={x.slug} href={`/pilotos/${x.slug}`} className="team-grad flex min-h-56 min-w-0 flex-col p-4 transition-[filter] hover:brightness-115" style={{ "--team": team.color } as CSSProperties}>
            <DriverPhoto slug={x.slug} name="" className="fade-left !absolute inset-y-0 right-0 -z-1 w-3/5" sizes="(min-width: 1024px) 170px, 30vw" />
            <span className="flex h-full min-w-0 flex-col items-start"><span className="block font-mono text-4xl font-black italic tabular-nums">{x.number}</span>
            <span className="wide mt-auto block pt-16 text-base leading-tight [text-shadow:0_1px_6px_#000]"><DriverName name={x.name} /><FavStar href={`/pilotos/${x.slug}`} /></span>
            <span className="text-sm [text-shadow:0_1px_6px_#000]">{x.nationality}</span></span>
          </Link>
        ))}
      </div>
      <Link href={`/escuderias/${team.slug}`} aria-label={`Ficha de ${team.name}`} className="grid grid-cols-[2fr_3fr]">
        <span className="flex items-center justify-center bg-white p-4">
          {ext ? (
            // SVG locales: el optimizador de imágenes no los procesa.
            <Image src={`/logos/${team.slug}.${ext}`} alt={`Logo de ${team.name}`} width={240} height={120} unoptimized className="h-24 w-full object-contain" />
          ) : (
            <span className="text-center text-2xl leading-tight font-bold text-asphalt">{team.name}</span>
          )}
        </span>
        <span className="relative aspect-video">
          <Image src={`/autos/${team.slug}.jpg`} alt={`${team.name} ${team.chassis}`} fill sizes="(min-width: 1024px) 340px, 60vw" className="object-cover" />
        </span>
      </Link>
      <p className="px-4 py-3 text-sm text-muted">
        {subs.length === 0 ? "Sin piloto reserva oficial" : subs.length === 1 ? "Piloto reserva: " : "Pilotos reserva: "}
        {subs.map((x, i) => (
          <span key={x.slug}>{i > 0 && ", "}<Link className="text-ink hover:underline" href={`/pilotos/${x.slug}`}>{x.name}</Link>{x.role !== "reserva" && ` (${x.role})`}</span>
        ))}
      </p>
    </section>
  );
}
