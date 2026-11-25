import type { Metadata } from "next";
import { Search } from "@/components/search";
import { roleLabel } from "@/components/ui";
import { circuits } from "@/data/circuits";
import { drivers } from "@/data/drivers";
import { getTeam, teams } from "@/data/teams";

export const metadata: Metadata = { title: "Buscar" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Buscar</h1>
      <Search items={[
        ...drivers.map((d) => ({ href: `/pilotos/${d.slug}`, name: d.name, detail: [d.number, d.teams.map((t) => getTeam(t)?.name).join(" y "), d.nationality, roleLabel[d.role]].filter(Boolean).join(", "), kind: "Pilotos" as const })),
        ...teams.map((t) => ({ href: `/escuderias/${t.slug}`, name: t.name, detail: `${t.base}, antes: ${t.eras.slice(0, -1).map((e) => e.name).join(", ") || "sin otros nombres"}`, kind: "Escuderías" as const })),
        ...circuits.map((c) => ({ href: `/circuitos/${c.slug}`, name: c.name, detail: `GP de ${c.gp}, ${c.place}, ${c.country}`, kind: "Circuitos" as const })),
      ]} />
    </>
  );
}
