import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Logo } from "@/components/logo";
import { author } from "@/data/site";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "F1 Info 2026", template: "%s | F1 Info" },
  description: "Escuderías, pilotos, circuitos y resultados de la Fórmula 1 2026.",
};

const links = [["/escuderias", "Escuderías"], ["/pilotos", "Pilotos"], ["/circuitos", "Circuitos"], ["/campeonato", "Campeonato"], ["/comparar", "Comparar"], ["/campeones", "Campeones"], ["/guia", "Guía"], ["/buscar", "Buscar"]];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <header className="border-b border-line">
          <nav aria-label="Principal" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><Logo className="h-7" />F1 Info</Link>
            <div className="-mx-5 flex max-w-[100vw] gap-5 overflow-x-auto px-5 py-1 text-sm whitespace-nowrap">
              {links.map(([href, label]) => <Link key={href} href={href} className="hover:underline">{label}</Link>)}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-12 pb-20">{children}</main>
        <footer className="border-t border-line">
          {author.name && author.linkedin && (
            <p className="mx-auto max-w-6xl px-5 pt-6 text-sm">Hecho por <a className="font-medium underline" href={author.linkedin} target="_blank" rel="noopener noreferrer">{author.name}</a></p>
          )}
          <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted">
            Sitio personal, sin relación con Formula 1 ni la FIA. Resultados: <a className="underline" href="https://github.com/jolpica/jolpica-f1">Jolpica-F1</a> (CC BY-NC-SA 4.0). Trayectorias: <a className="underline" href="https://en.wikipedia.org/wiki/2026_Formula_One_World_Championship">Wikipedia</a> (CC BY-SA 4.0). Fotos: <Link className="underline" href="/creditos">créditos</Link>. Trazados: <a className="underline" href="https://github.com/bacinger/f1-circuits">f1-circuits</a> (MIT). Los logos son marcas de sus dueños.
          </p>
        </footer>
      </body>
    </html>
  );
}
