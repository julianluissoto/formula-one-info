import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { titulares } from "@/data/drivers";
import { teams } from "@/data/teams";

export const metadata: Metadata = { title: "Escuderías" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Escuderías</h1>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {teams.map((t) => (
          <li key={t.slug}>
            <Link href={`/escuderias/${t.slug}`} className="slot block h-full px-5 py-4" style={{ "--slot": t.color } as CSSProperties}>
              <span className="text-xl font-semibold">{t.name}</span>
              <span className="mt-1 block text-sm text-muted">{titulares.filter((x) => x.teams.includes(t.slug)).map((x) => x.name).join(" y ")}</span>
              {t.eras.length > 1 && <span className="mt-3 block text-sm text-muted">Antes: {t.eras.slice(0, -1).map((e) => e.name).join(" → ")}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
