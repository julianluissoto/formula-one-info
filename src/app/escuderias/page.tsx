import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { titulares } from "@/data/drivers";
import { teams } from "@/data/teams";

export const metadata: Metadata = { title: "Escuderías" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Escuderías</h1>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {teams.map((t) => (
          <li key={t.slug}>
            <Link href={`/escuderias/${t.slug}`} className="team-grad flex h-full flex-col rounded-md transition-[filter] hover:brightness-115" style={{ "--team": t.color } as CSSProperties}>
              <span className="relative block aspect-[21/9]"><Image src={`/autos/${t.slug}.jpg`} alt="" fill sizes="(min-width: 768px) 550px, 100vw" className="object-cover [mask-image:linear-gradient(#000_60%,transparent)]" /></span>
              <span className="block px-5 pb-5">
              <span className="wide block text-2xl font-extrabold">{t.name}</span>
              <span className="mt-1 block font-semibold">{titulares.filter((x) => x.teams.includes(t.slug)).map((x) => x.name).join(" y ")}</span>
              {t.eras.length > 1 && <span className="mt-3 block text-sm">Antes: {t.eras.slice(0, -1).map((e) => e.name).join(" → ")}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
