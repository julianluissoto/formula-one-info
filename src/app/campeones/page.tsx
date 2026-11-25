import type { Metadata } from "next";
import { Section, Table, plural, td, th } from "@/components/ui";
import champions from "@/data/champions.json";

export const metadata: Metadata = { title: "Campeones" };

function top(list: (string | null)[], n: number) {
  const count = new Map<string, number>();
  for (const x of list) if (x) count.set(x, (count.get(x) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default function Page() {
  // Wikipedia, 25/11/2026: ambos títulos de 2026 ya están definidos.
  const all = [...champions, { year: 2026, driver: "Kimi Antonelli", team: "Mercedes", constructor: "Mercedes" }];
  const lists = [["Pilotos con más títulos", top(all.map((x) => x.driver), 6)], ["Constructores con más títulos", top(all.map((x) => x.constructor), 6)]] as const;
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Campeones</h1>
      <p className="mt-4 text-lg text-muted">Todos los títulos desde 1950. El de constructores se entrega desde 1958.</p>
      <div className="grid gap-x-10 md:grid-cols-2">
        {lists.map(([title, rows]) => (
          <Section key={title} title={title}>
            <ol className="rounded-md bg-panel px-4">{rows.map(([name, n]) => <li key={name} className="flex justify-between border-t border-line py-2.5 first:border-0"><span>{name}</span><span className="text-muted tabular-nums">{plural(n, "título", "títulos")}</span></li>)}</ol>
          </Section>
        ))}
      </div>
      <Section title="Año por año">
        <Table>
          <thead><tr><th className={th}>Año</th><th className={th}>Piloto</th><th className={th}>Escudería</th><th className={th}>Constructor campeón</th></tr></thead>
          <tbody>{all.toReversed().map((x) => <tr key={x.year}><td className={td}>{x.year}</td><td className={`${td} font-medium`}>{x.driver}</td><td className={td}>{x.team}</td><td className={td}>{x.constructor ?? "–"}</td></tr>)}</tbody>
        </Table>
      </Section>
    </>
  );
}
