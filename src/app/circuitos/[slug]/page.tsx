import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Track } from "@/components/track";
import { RoundResults } from "@/components/results";
import { RaceTyres } from "@/components/tyres";
import { Facts, Notice, Section, formatDate } from "@/components/ui";
import { circuits, getCircuit } from "@/data/circuits";
import { drivers } from "@/data/drivers";
import { getRound } from "@/data/season";

export const generateStaticParams = () => circuits.map(({ slug }) => ({ slug }));

export async function generateMetadata(props: PageProps<"/circuitos/[slug]">): Promise<Metadata> {
  return { title: getCircuit((await props.params).slug)?.name };
}

const km = (n: number) => `${n.toLocaleString("es-AR", { minimumFractionDigits: 3 })} km`;

export default async function Page(props: PageProps<"/circuitos/[slug]">) {
  const c = getCircuit((await props.params).slug);
  if (!c) notFound();
  const [time, holder, year] = c.record;
  const round = getRound(c.round);
  const driver = drivers.find((x) => x.name === holder);

  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{c.name}</h1>
      <p className="mt-3 text-lg text-muted">GP de {c.gp}, ronda {c.round}, {formatDate(c.date)}{c.sprint && ", con sprint"}</p>
      <Track animated slug={c.slug} name={c.name} className="mt-8 h-72 w-full rounded-md bg-panel p-6 sm:h-96" />
      <Facts items={[
        ["Lugar", c.place === c.country ? c.place : `${c.place}, ${c.country}`],
        ["Tipo", c.kind],
        ["Inaugurado", c.since],
        ["Longitud", km(c.km)],
        ["Curvas", c.turns],
        ["Vueltas", c.laps],
        ["Distancia de carrera", km(c.raceKm)],
      ]} />

      {round && round.results.length > 0 && <RoundResults round={round} />}

      <Section title="Récord de vuelta en carrera">
        <p className="font-mono text-4xl font-semibold tabular-nums">{time}</p>
        <p className="mt-1 text-muted">{driver ? <Link className="text-ink hover:underline" href={`/pilotos/${driver.slug}`}>{holder}</Link> : holder}, {year}</p>
      </Section>

      <Section title="Neumáticos para este Gran Premio">
        {c.tyres ? <RaceTyres compounds={c.tyres} /> : <Notice>Todavía no tenemos confirmados los compuestos de esta carrera.</Notice>}
        <p className="mt-5 text-sm"><Link className="underline" href="/circuitos#neumaticos">Ver todos los compuestos</Link></p>
      </Section>
    </>
  );
}
