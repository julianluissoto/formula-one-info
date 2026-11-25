import type { Metadata } from "next";
import credits from "@/data/photo-credits.json";
import { teams } from "@/data/teams";

export const metadata: Metadata = { title: "Créditos de las fotos" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Créditos de las fotos</h1>
      <p className="mt-4 text-muted">Imágenes de Wikimedia Commons, reducidas y recortadas. Licencia <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
      <ul className="mt-8 space-y-2">
        {teams.map((t) => {
          const c = credits[t.slug as keyof typeof credits];
          return <li key={t.slug}>{t.name} {t.chassis}: {c.author}, <a className="underline" href={c.url}>{c.license}</a></li>;
        })}
      </ul>
    </>
  );
}
