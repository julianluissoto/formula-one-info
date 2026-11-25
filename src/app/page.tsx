import Link from "next/link";
import { Suspense } from "react";
import { Favorites } from "@/components/favorite";
import { Fold } from "@/components/fold";
import { Logo } from "@/components/logo";
import { NextRace } from "@/components/next-race";
import { Track } from "@/components/track";
import { RaceTyres } from "@/components/tyres";
import { TeamCard } from "@/components/team-card";
import { ApiNotice, Skeleton, Table, TeamBadge, formatDate, formatPos, td, tdNum, th, thNum } from "@/components/ui";
import { circuits } from "@/data/circuits";
import { drivers, getDriverByJolpicaId, titulares } from "@/data/drivers";
import { rounds } from "@/data/season";
import { getTeam, getTeamByJolpicaId, teams } from "@/data/teams";
import { getLastRace, getStandings } from "@/lib/jolpica";

const upcoming = rounds.filter((r) => !r.results.length).flatMap((r) => {
  const c = circuits.find((x) => x.round === r.round);
  return c ? [{ slug: c.slug, gp: c.gp, circuit: c.name, sessions: r.sessions, track: <Track animated slug={c.slug} name={c.name} className="h-48 w-full" />, tyres: c.tyres && <RaceTyres compounds={c.tyres} compact /> }] : [];
});

const favorites = [
  ...drivers.map((x) => ({ href: `/pilotos/${x.slug}`, name: x.name, detail: x.teams.map((t) => getTeam(t)?.name).join(" y "), color: getTeam(x.teams[0])!.color })),
  ...teams.map((t) => ({ href: `/escuderias/${t.slug}`, name: t.name, detail: "Escudería", color: t.color })),
];

export default function Home() {
  return (
    <>
      <h1 className="flex items-center gap-4 text-6xl font-semibold tracking-tight sm:text-7xl"><Logo className="h-20 shrink-0 sm:h-24" />F1 Info</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">La temporada 2026 en un solo lugar: {teams.length} escuderías, {titulares.length} titulares, circuitos y resultados.</p>

      <div className="mt-10">
        {upcoming.length > 0 && <Fold id="proxima" title="Próxima carrera" aside={`Gran Premio de ${upcoming[0].gp}`} defaultOpen><NextRace races={upcoming} /></Fold>}
        <Favorites items={favorites} />
        <Fold id="escuderias" title="Escuderías y pilotos" aside={`${teams.length} escuderías`}>
          <div className="grid gap-6 lg:grid-cols-2">
            {teams.map((team) => <TeamCard key={team.slug} team={team} />)}
          </div>
        </Fold>
        <Suspense fallback={<Skeleton />}>
          <Live />
        </Suspense>
      </div>
    </>
  );
}

async function Live() {
  const [s, race] = await Promise.all([getStandings(), getLastRace()]);
  if (!s) return <Fold id="campeonatos" title="Campeonatos" defaultOpen><ApiNotice /></Fold>;

  const official = new Set(titulares.map((x) => x.jolpicaId));
  const subs = s.drivers.filter((x) => !official.has(x.Driver.driverId));
  const inLastRace = new Set(race?.results.map((r) => r.Driver.driverId));
  const name = (x: { driverId: string; givenName: string; familyName: string }) => {
    const local = getDriverByJolpicaId(x.driverId);
    return local ? <Link className="hover:underline" href={`/pilotos/${local.slug}`}>{local.name}</Link> : `${x.givenName} ${x.familyName}`;
  };
  const badge = (c: { constructorId: string; name: string }) => {
    const t = getTeamByJolpicaId(c.constructorId);
    return t ? <TeamBadge team={t} /> : c.name;
  };
  const aside = `${s.season}, tras la ronda ${s.round}`;

  return (
    <>
      {subs.length > 0 && (
        <Fold id="reemplazos" title="Corrieron como reemplazo" aside={race ? `Última carrera: ronda ${race.round}, ${formatDate(race.date)}` : undefined}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subs.map((x) => (
              <li key={x.Driver.driverId} className="rounded-md bg-panel px-4 py-3">
                <span className="font-medium">{name(x.Driver)}</span>
                <span className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">{x.Constructors.map((c) => <span key={c.constructorId}>{badge(c)}</span>)}</span>
                {inLastRace.has(x.Driver.driverId) && <span className="mt-1 block text-sm text-signal">Corrió la última carrera</span>}
              </li>
            ))}
          </ul>
        </Fold>
      )}
        <Fold id="pilotos" title="Campeonato de pilotos" aside={aside}>
          <Table>
            <thead><tr><th className={th}>Pos.</th><th className={th}>Piloto</th><th className={th}>Escudería</th><th className={thNum}>Vict.</th><th className={thNum}>Puntos</th></tr></thead>
            <tbody>{s.drivers.map((x) => (
              <tr key={x.Driver.driverId}>
                <td className={td}>{formatPos(x.position)}</td>
                <td className={td}>{name(x.Driver)}</td>
                <td className={td}>{x.Constructors.map((c) => <div key={c.constructorId}>{badge(c)}</div>)}</td>
                <td className={tdNum}>{x.wins}</td>
                <td className={`${tdNum} font-semibold`}>{x.points}</td>
              </tr>
            ))}</tbody>
          </Table>
        </Fold>
        <Fold id="constructores" title="Campeonato de constructores" aside={aside}>
          <Table>
            <thead><tr><th className={th}>Pos.</th><th className={th}>Escudería</th><th className={thNum}>Vict.</th><th className={thNum}>Puntos</th></tr></thead>
            <tbody>{s.constructors.map((x) => (
              <tr key={x.Constructor.constructorId}>
                <td className={td}>{formatPos(x.position)}</td>
                <td className={td}>{badge(x.Constructor)}</td>
                <td className={tdNum}>{x.wins}</td>
                <td className={`${tdNum} font-semibold`}>{x.points}</td>
              </tr>
            ))}</tbody>
          </Table>
        </Fold>
    </>
  );
}
