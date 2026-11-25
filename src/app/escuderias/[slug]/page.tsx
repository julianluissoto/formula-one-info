import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties } from "react";
import { ApiNotice, DriverRow, Facts, Section, Skeleton, Table, champion, formatPos, plural, td, tdNum, th, thNum } from "@/components/ui";
import { FavButton } from "@/components/favorite";
import { drivers } from "@/data/drivers";
import { teamHistory } from "@/data/history";
import { getTeam, teams } from "@/data/teams";
import type { Team } from "@/data/types";
import { getStandings } from "@/lib/jolpica";

export const generateStaticParams = () => teams.map(({ slug }) => ({ slug }));

export async function generateMetadata(props: PageProps<"/escuderias/[slug]">): Promise<Metadata> {
  return { title: getTeam((await props.params).slug)?.name };
}

export default async function Page(props: PageProps<"/escuderias/[slug]">) {
  const team = getTeam((await props.params).slug);
  if (!team) notFound();
  const own = drivers.filter((x) => x.teams.includes(team.slug));

  return (
    <>
      <div className="team-grad flex min-h-64 items-end rounded-md p-5 sm:min-h-96 sm:p-8" style={{ "--team": team.color } as CSSProperties}>
        <Image src={`/autos/${team.slug}.jpg`} alt={`${team.name} ${team.chassis}`} fill preload sizes="(min-width: 1152px) 1112px, 100vw" className="-z-1 object-cover" />
        <span aria-hidden className="absolute inset-0 -z-1" style={{ background: `linear-gradient(to top, color-mix(in oklab, ${team.color} 30%, #000), transparent 75%)` }} />
        <div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{team.name}</h1>
          <p className="mt-2 text-lg">{team.fullName}</p>
        </div>
      </div>
      <div className="mt-6"><FavButton href={`/escuderias/${team.slug}`} name={team.name} /></div>
      <Facts items={[["Base", team.base], ["Chasis", team.chassis], ["Unidad de potencia", team.powerUnit], ["Linaje desde", team.eras[0].from]]} />

      <Section title="Pilotos 2026">
        <div className="grid gap-5 md:grid-cols-2">{own.map((x) => <DriverRow key={x.slug} driver={x} />)}</div>
        {own.every((x) => x.role === "titular") && <p className="mt-3 text-sm text-muted">Sin reserva oficial.</p>}
      </Section>

      <Section title="Línea de tiempo de nombres">
        <ol className="flex flex-col gap-2 sm:flex-row">
          {team.eras.map((e) => (
            <li key={e.name + e.from} className="min-w-0 flex-1 border-t-4 border-line bg-panel px-4 py-3" style={e.to === null ? { borderColor: team.color } : undefined}>
              <span className="block font-medium">{e.name}</span>
              <span className="text-sm text-muted tabular-nums">{e.to === null ? `${e.from}–hoy` : e.from === e.to ? e.from : `${e.from}–${e.to}`}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Campeonato de constructores" aside="Se disputa desde 1958">
        <Suspense fallback={<Skeleton />}><History team={team} /></Suspense>
      </Section>
    </>
  );
}

async function History({ team }: { team: Team }) {
  const s = await getStandings();
  const live = s?.constructors.find((x) => x.Constructor.constructorId === team.jolpicaId);
  const past = teamHistory(team);
  const rows = live && s
    ? [...past, { season: s.season, position: live.position ?? null, points: +live.points, wins: +live.wins, era: team.name }]
    : past;
  // La temporada en curso no cuenta como título hasta que entre al historial cerrado.
  const titles = past.filter((r) => r.position === "1").length;
  const seasons = new Set(rows.map((r) => r.season)).size;
  const wins = rows.reduce((a, r) => a + r.wins, 0);

  return (
    <>
      {!s && <div className="mb-4"><ApiNotice /></div>}
      <p className="mb-4 text-muted">{plural(seasons, "temporada", "temporadas")}, {plural(titles, "título", "títulos")} y {plural(wins, "victoria", "victorias")}, sumando todas las eras.</p>
      <Table>
        <thead><tr><th className={th}>Año</th><th className={th}>Nombre</th><th className={th}>Pos.</th><th className={thNum}>Vict.</th><th className={thNum}>Puntos</th></tr></thead>
        <tbody>{rows.toSorted((a, b) => b.season - a.season).map((r, i) => (
          <tr key={i}>
            <td className={td}>{r.season}</td>
            <td className={td}>{r.era}</td>
            <td className={td + (r.position === "1" ? champion : "")}>{formatPos(r.position)}</td>
            <td className={tdNum}>{r.wins}</td>
            <td className={tdNum}>{r.points}</td>
          </tr>
        ))}</tbody>
      </Table>
    </>
  );
}
