import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import { Suspense } from "react";
import { Favorites } from "@/components/favorite";
import { Fold } from "@/components/fold";
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
import { getSessionBests } from "@/lib/openf1";

const upcoming = rounds.filter((r) => !r.results.length).flatMap((r) => {
  const c = circuits.find((x) => x.round === r.round);
  return c ? [{ slug: c.slug, gp: c.gp, circuit: c.name, record: c.record, sessions: r.sessions, track: <Track animated slug={c.slug} name={c.name} className="h-48 w-full" />, tyres: c.tyres && <RaceTyres compounds={c.tyres} compact /> }] : [];
});

const favorites = [
  ...drivers.map((x) => ({ href: `/pilotos/${x.slug}`, name: x.name, detail: x.teams.map((t) => getTeam(t)?.name).join(" y "), color: getTeam(x.teams[0])!.color })),
  ...teams.map((t) => ({ href: `/escuderias/${t.slug}`, name: t.name, detail: "Escudería", color: t.color })),
];

const cards = [
  ["/escuderias", "Escuderías", "/autos/ferrari.jpg"],
  ["/pilotos", "Pilotos", "/pilotos/franco-colapinto.jpg"],
  ["/campeonato", "Campeonato", "/autos/mclaren.jpg"],
  ["/monoplaza", "Monoplaza 2026", "/autos/mercedes.jpg"],
];

const shortcuts = [["/circuitos", "Circuitos"], ["/comparar", "Comparar pilotos"], ["/campeones", "Campeones"], ["/guia", "Guía 2026"], ["/buscar", "Buscar"]];

export default function Home() {
  return (
    <>
      <nav aria-label="Accesos rápidos" className="mb-6 flex flex-wrap gap-2">
        {shortcuts.map(([href, label]) => <Link key={href} href={href} className="rounded-full bg-panel-hover px-4 py-2 text-sm font-bold transition-colors hover:bg-line">{label}</Link>)}
      </nav>
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="relative isolate flex min-h-80 items-end overflow-hidden rounded-md p-5 sm:min-h-[26rem] sm:p-7">
          <Image src="/autos/alpine.jpg" alt="" fill preload sizes="(min-width: 1024px) 660px, 100vw" className="-z-1 object-cover" />
          <span aria-hidden className="absolute inset-0 -z-1 bg-linear-to-t from-black via-black/60 to-transparent" />
          <div>
            <span className="rounded-sm bg-race px-2 py-0.5 text-xs font-bold uppercase">Temporada 2026</span>
            <h1 className="mt-3"><Image src={logo} alt="Fórmula Info" className="h-auto w-72 sm:w-96" sizes="384px" /></h1>
            <p className="mt-2 max-w-xl text-lg">{teams.length} escuderías, {titulares.length} titulares, circuitos y resultados en un solo lugar.</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-5">
          {cards.map(([href, label, src]) => (
            <li key={href}><Link href={href} className="group flex h-full flex-col overflow-hidden rounded-md bg-panel">
              <span className="relative block min-h-28 flex-1 overflow-hidden"><Image src={src} alt="" fill sizes="(min-width: 1024px) 220px, 50vw" className="object-cover object-[50%_25%] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" /></span>
              <span className="px-3 py-3 font-bold">{label}</span>
            </Link></li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        {upcoming.length > 0 && <Fold id="proxima" title="Próxima carrera" aside={`Gran Premio de ${upcoming[0].gp}`} defaultOpen><Suspense fallback={<NextRace races={upcoming} />}><RaceWithBests /></Suspense></Fold>}
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

/** La próxima carrera con la vuelta más rápida de cada sesión ya corrida (OpenF1). */
async function RaceWithBests() {
  const bests = await getSessionBests(upcoming[0].sessions.map(({ at }) => ({ at })));
  return <NextRace races={upcoming} bests={bests} />;
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
