import type { Metadata } from "next";
import Link from "next/link";
import { Track } from "@/components/track";
import { TyreBanner } from "@/components/tyres";
import { Section, formatDate } from "@/components/ui";
import { circuits } from "@/data/circuits";

export const metadata: Metadata = { title: "Circuitos" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Circuitos</h1>
      <TyreBanner />
      <Section title="Calendario 2026" aside={`${circuits.length} carreras`}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {circuits.map((c) => (
            <li key={c.slug}>
              <Link href={`/circuitos/${c.slug}`} className="block h-full rounded-md bg-panel p-4 transition-colors hover:bg-panel-hover">
                <Track slug={c.slug} name={c.name} className="mx-auto mb-4 h-44 w-full" />
                <span className="flex gap-4">
                <span className="w-9 shrink-0 font-mono text-2xl font-semibold text-muted tabular-nums">{c.round}</span>
                <span className="min-w-0">
                  <span className="block font-medium">{c.name}</span>
                  <span className="block text-sm text-muted">GP de {c.gp}, {formatDate(c.date)}</span>
                  <span className="mt-2 block text-sm text-muted tabular-nums">{c.km.toLocaleString("es-AR", { minimumFractionDigits: 3 })} km, {c.turns} curvas{c.tyres && `, ${c.tyres[0]} a ${c.tyres[2]}`}</span>
                  {c.sprint && <span className="mt-1 block text-sm text-signal">Con sprint</span>}
                </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
