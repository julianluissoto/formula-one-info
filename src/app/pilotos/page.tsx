import type { Metadata } from "next";
import { DriverRow, Section } from "@/components/ui";
import { suplentes, titulares } from "@/data/drivers";

export const metadata: Metadata = { title: "Pilotos" };

const grid = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Pilotos</h1>
      <Section title="Titulares"><div className={grid}>{titulares.map((x) => <DriverRow key={x.slug} driver={x} />)}</div></Section>
      <Section title="Reservas y reemplazos"><div className={grid}>{suplentes.map((x) => <DriverRow key={x.slug} driver={x} />)}</div></Section>
    </>
  );
}
