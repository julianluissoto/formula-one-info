import type { Metadata } from "next";
import credits from "@/data/photo-credits.json";
import driverPhotos from "@/data/driver-photos.json";
import { getDriver } from "@/data/drivers";
import { teams } from "@/data/teams";

export const metadata: Metadata = { title: "Créditos de las fotos" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Créditos de las fotos</h1>
      <p className="mt-4 text-muted">Imágenes de Wikimedia Commons, salvo donde se indica otra fuente, reducidas y recortadas. Cada enlace lleva al original y su licencia. Los autos son <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">Autos</h2>
      <ul className="mt-4 space-y-2">
        {teams.map((t) => {
          const c = credits[t.slug as keyof typeof credits];
          return <li key={t.slug}>{t.name} {t.chassis}: {c.author}, <a className="underline" href={c.url}>{c.license}</a></li>;
        })}
      </ul>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Pilotos</h2>
      <ul className="mt-4 space-y-2">
        {Object.entries(driverPhotos).map(([slug, c]) => <li key={slug}>{getDriver(slug)?.name}: <a className="underline" href={c.url}>{c.author}</a>, {c.licenseUrl ? <a className="underline" href={c.licenseUrl}>{c.license}</a> : c.license}</li>)}
      </ul>
    </>
  );
}
