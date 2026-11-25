import Link from "next/link";
import type { ReactNode } from "react";
import { Section, Table, TeamBadge, td, tdNum, th, thNum } from "@/components/ui";
import { getDriverByJolpicaId } from "@/data/drivers";
import { driverName, type QualiRow, type RaceRow, type Round } from "@/data/season";
import { getTeamByJolpicaId } from "@/data/teams";

const status: Record<string, string> = { R: "Abandono", W: "No largó", D: "Descalificado", E: "Excluido", F: "No clasificó", N: "No clasificado" };
const shortStatus: Record<string, string> = { R: "AB", W: "NL", D: "DSQ", E: "EX", F: "NQ", N: "NC" };

const lapped = (t: string | null) => (t === "Lapped" ? "Con vueltas perdidas" : (t?.replace(/Laps?/, (m) => (m === "Lap" ? "vuelta" : "vueltas")) || "–"));

export function DriverLink({ id }: { id: string }) {
  const d = getDriverByJolpicaId(id);
  return d ? <Link href={`/pilotos/${d.slug}`} className="hover:underline">{d.name}</Link> : driverName(id);
}

function TeamCell({ id }: { id: string }) {
  const t = getTeamByJolpicaId(id);
  return t ? <TeamBadge team={t} /> : id;
}

export function RaceTable({ rows, sprint }: { rows: RaceRow[]; sprint?: boolean }) {
  return (
    <Table>
      <thead><tr><th className={th}>Pos.</th><th className={th}>Piloto</th><th className={th}>Escudería</th><th className={thNum}>Largada</th><th className={thNum}>Tiempo</th>{!sprint && <th className={thNum}>Mejor vuelta</th>}<th className={thNum}>Puntos</th></tr></thead>
      <tbody>{rows.map((x) => (
        <tr key={x.d}>
          <td className={td}>{status[x.text] ? <abbr title={status[x.text]} className="no-underline">{shortStatus[x.text]}</abbr> : `${x.pos}º`}</td>
          <td className={td}><DriverLink id={x.d} /></td>
          <td className={td}><TeamCell id={x.t} /></td>
          <td className={tdNum}>{x.grid || "Boxes"}</td>
          <td className={`${tdNum} whitespace-nowrap`}>{status[x.text] ?? lapped(x.time)}</td>
          {!sprint && <td className={tdNum + (x.flRank === 1 ? " font-semibold text-signal" : "")}>{x.fl ?? "–"}</td>}
          <td className={tdNum}>{x.pts}</td>
        </tr>
      ))}</tbody>
    </Table>
  );
}

function QualiTable({ rows }: { rows: QualiRow[] }) {
  return (
    <Table>
      <thead><tr><th className={th}>Pos.</th><th className={th}>Piloto</th><th className={th}>Escudería</th><th className={thNum}>Q1</th><th className={thNum}>Q2</th><th className={thNum}>Q3</th></tr></thead>
      <tbody>{rows.map((x) => (
        <tr key={x.d}>
          <td className={td}>{x.pos}º</td><td className={td}><DriverLink id={x.d} /></td><td className={td}><TeamCell id={x.t} /></td>
          {[x.q1, x.q2, x.q3].map((q, i) => <td key={i} className={tdNum}>{q ?? "–"}</td>)}
        </tr>
      ))}</tbody>
    </Table>
  );
}

const Fold = ({ title, children }: { title: string; children: ReactNode }) => (
  <details className="mt-3">
    <summary className="cursor-pointer rounded-md bg-panel px-4 py-3 font-medium hover:bg-panel-hover">{title}</summary>
    <div className="mt-2">{children}</div>
  </details>
);

export function RoundResults({ round }: { round: Round }) {
  return (
    <Section title="Resultado de la carrera" aside="En amarillo, la vuelta más rápida">
      <RaceTable rows={round.results} />
      {round.quali.length > 0 && <Fold title="Clasificación"><QualiTable rows={round.quali} /></Fold>}
      {round.sprint.length > 0 && <Fold title="Sprint"><RaceTable rows={round.sprint} sprint /></Fold>}
    </Section>
  );
}
