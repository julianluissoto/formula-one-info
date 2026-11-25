import type { Metadata } from "next";
import { PointsChart } from "@/components/points-chart";
import { DriverLink } from "@/components/results";
import { Section, Table, td, tdNum, th, thNum } from "@/components/ui";
import { played, pointsByRound, roundLabels, seasonYear } from "@/data/season";

export const metadata: Metadata = { title: "Campeonato" };

export default function Page() {
  const lines = pointsByRound();
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Campeonato {seasonYear}</h1>
      <p className="mt-4 text-lg text-muted">La pelea por el título, carrera a carrera.</p>
      <Section title="Los seis primeros" aside={`Tras la ronda ${played.at(-1)?.round}`}>
        <PointsChart lines={lines.slice(0, 6).map(({ id, name, cumulative }) => ({ id, name, cumulative }))} labels={roundLabels} />
      </Section>
      <Section title="Puntos tras cada ronda">
        <Table>
          <thead><tr><th className={th}>Piloto</th>{played.map((r, i) => <th key={r.round} className={thNum}><abbr title={roundLabels[i]} className="no-underline">{r.round}</abbr></th>)}</tr></thead>
          <tbody>{lines.map((l) => (
            <tr key={l.id}><td className={`${td} whitespace-nowrap`}><DriverLink id={l.id} /></td>{l.cumulative.map((v, i) => <td key={i} className={tdNum}>{v}</td>)}</tr>
          ))}</tbody>
        </Table>
      </Section>
    </>
  );
}
