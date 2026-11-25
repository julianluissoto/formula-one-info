import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/titillium-web/latin-400.css";
import "@fontsource/titillium-web/latin-600.css";
import "@fontsource/titillium-web/latin-700.css";
import { Logo } from "@/components/logo";
import { author } from "@/data/site";
import { Nav } from "@/components/nav";
import Link from "next/link";
import { Suspense } from "react";
import { RaceStrip } from "@/components/race-strip";
import { upcomingRaces } from "@/data/upcoming";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "F1 Info 2026", template: "%s | F1 Info" },
  description: "Escuderías, pilotos, circuitos y resultados de la Fórmula 1 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${GeistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <header className="sticky top-0 z-30 bg-asphalt">
          <div className="stripes relative border-b border-line">
          <nav aria-label="Principal" className="mx-auto flex min-h-15 max-w-6xl items-center justify-between gap-x-6 px-5">
            <Link href="/" className="flex shrink-0 items-center gap-2 wide py-2 text-xl font-black tracking-tight uppercase italic"><Logo className="h-7" />F1 Info</Link>
            <Suspense><Nav /></Suspense>
          </nav>
          </div>
          <RaceStrip races={upcomingRaces} />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-12 pb-20">{children}</main>
        <footer className="border-t-4 border-race bg-black">
          {author.name && author.linkedin && (
            <p className="mx-auto max-w-6xl px-5 pt-8">
              <a className="inline-flex items-center gap-3 hover:underline" href={author.linkedin} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" role="img" aria-label="LinkedIn" className="size-7 shrink-0"><rect width="24" height="24" rx="3" fill="#0a66c2" /><path fill="#fff" d="M3.6 9h3.5v11.4H3.6zM5.35 3.3a2.05 2.05 0 1 1 0 4.1 2.05 2.05 0 0 1 0-4.1zM9.3 9h3.4v1.56h.05c.47-.9 1.63-1.84 3.36-1.84 3.6 0 4.26 2.37 4.26 5.45v6.25h-3.55v-5.54c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.63H9.3z" /></svg>
                <span>Creado por: <b>{author.name}</b></span>
              </a>
            </p>
          )}
          <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted">
            Sitio personal, sin relación con Formula 1 ni la FIA. Resultados: <a className="underline" href="https://github.com/jolpica/jolpica-f1">Jolpica-F1</a> (CC BY-NC-SA 4.0). Trayectorias: <a className="underline" href="https://en.wikipedia.org/wiki/2026_Formula_One_World_Championship">Wikipedia</a> (CC BY-SA 4.0). Fotos: <Link className="underline" href="/creditos">créditos</Link>. Trazados: <a className="underline" href="https://github.com/bacinger/f1-circuits">f1-circuits</a> (MIT). Los logos son marcas de sus dueños.
          </p>
        </footer>
      </body>
    </html>
  );
}
