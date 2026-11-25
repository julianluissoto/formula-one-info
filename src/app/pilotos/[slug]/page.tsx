import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ApiNotice, Facts, Notice, Section, Skeleton, Table, TeamBadges, champion, formatDate, formatPos, plural, roleLabel, td, tdNum, th, thNum } from "@/components/ui";
import { drivers, getDriver } from "@/data/drivers";
import { driverHistory } from "@/data/history";
import { getTeam } from "@/data/teams";
import type { Driver } from "@/data/types";
import { getStandings } from "@/lib/jolpica";

const YEARS = 10;

export const generateStaticParams = () => drivers.map(({ slug }) => ({ slug }));

export async function generateMetadata(props: PageProps<"/pilotos/[slug]">): Promise<Metadata> {
  return { title: getDriver((await props.params).slug)?.name };
}

export default async function Page(props: PageProps<"/pilotos/[slug]">) {
  const driver = getDriver((await props.params).slug);
  if (!driver) notFound();

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {driver.number !== null && <span className="font-mono text-7xl font-semibold tabular-nums" style={{ color: getTeam(driver.teams[0])?.color }}>{driver.number}</span>}
        <div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{driver.name}</h1>
          <p className="mt-2 text-lg text-muted"><TeamBadges slugs={driver.teams} /></p>
        </div>
      </div>
      <Facts items={[["Rol", roleLabel[driver.role]], ["Nacionalidad", driver.nationality], ["Nacimiento", formatDate(driver.birthDate)], ["Lugar", driver.birthPlace]]} />
      {driver.note && <p className="mt-6 max-w-2xl text-muted">{driver.note}</p>}

      <Section title="Historial en F1" aside={`Últimos ${YEARS} años`}>
        <Suspense fallback={<Skeleton />}><History driver={driver} /></Suspense>
      </Section>

      <Section title="Karting">
        <p className="max-w-2xl">{driver.karting || "Todavía no hay datos cargados."}</p>
      </Section>

      <Section title="Trayectoria en otras categorías">
        <Table>
          <thead><tr><th className={th}>Temporada</th><th className={th}>Categoría</th><th className={th}>Equipo</th>{["Carreras", "Vict.", "Poles", "Podios", "Puntos", "Pos."].map((h) => <th key={h} className={thNum}>{h}</th>)}</tr></thead>
          <tbody>{driver.career.map((e, i) => (
            <tr key={i}>
              <td className={`${td} whitespace-nowrap`}>{e.season}</td>
              <td className={td}>{e.series}</td>
              <td className={td}>{e.team}</td>
              {e.role ? <td className={`${tdNum} text-muted`} colSpan={6}>{e.role}</td> : (
                <>
                  {[e.races, e.wins, e.poles, e.podiums, e.points].map((v, k) => <td key={k} className={tdNum}>{v ?? "–"}</td>)}
                  <td className={tdNum + (e.position === "1º" ? champion : "")}>{e.position ?? "–"}</td>
                </>
              )}
            </tr>
          ))}</tbody>
        </Table>
      </Section>
    </>
  );
}

async function History({ driver }: { driver: Driver }) {
  const s = driver.jolpicaId ? await getStandings() : null;
  const live = s?.drivers.find((x) => x.Driver.driverId === driver.jolpicaId);
  const past = driverHistory(driver.jolpicaId);
  const rows = live && s
    ? [...past, { season: s.season, position: live.position ?? null, points: +live.points, wins: +live.wins, teams: live.Constructors.map((c) => c.name) }]
    : past;
  const failed = driver.jolpicaId && !s;
  if (!rows.length) return failed ? <ApiNotice /> : <Notice>Todavía no corrió un Gran Premio.</Notice>;

  const recent = rows.filter((r) => r.season > (s?.season ?? 2026) - YEARS);
  // La temporada en curso no cuenta como título hasta que entre al historial cerrado.
  const titles = past.filter((r) => r.position === "1").length;
  const wins = rows.reduce((a, r) => a + r.wins, 0);
  return (
    <>
      {failed && <div className="mb-4"><ApiNotice /></div>}
      <p className="mb-4 text-muted">{plural(rows.length, "temporada", "temporadas")}, {plural(titles, "título", "títulos")} y {plural(wins, "victoria", "victorias")} en toda su carrera.</p>
      {recent.length === 0 && <Notice>No corrió en F1 en los últimos {YEARS} años.</Notice>}
      {recent.length > 0 && <Table>
        <thead><tr><th className={th}>Año</th><th className={th}>Escudería</th><th className={th}>Pos.</th><th className={thNum}>Vict.</th><th className={thNum}>Puntos</th></tr></thead>
        <tbody>{recent.toReversed().map((r) => (
          <tr key={r.season}>
            <td className={td}>{r.season}</td>
            <td className={td}>{r.teams.join(" / ")}</td>
            <td className={td + (r.position === "1" ? champion : "")}>{formatPos(r.position)}</td>
            <td className={tdNum}>{r.wins}</td>
            <td className={tdNum}>{r.points}</td>
          </tr>
        ))}</tbody>
      </Table>}
    </>
  );
}
