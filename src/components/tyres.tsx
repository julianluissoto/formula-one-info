import type { CSSProperties } from "react";
import { roles, tyres, type Tyre } from "@/data/tyres";

/** Neumático visto de costado. Los rayos y las marcas hacen visible el giro. */
export function TyreIcon({ label, color, tread = "slick", className }: { label: string; color: string; tread?: Tyre["tread"]; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <circle cx="50" cy="50" r="48" fill="#08090b" stroke="#4a505b" strokeWidth="1.5" />
      {tread !== "slick" && (
        <circle cx="50" cy="50" r="46.5" fill="none" stroke="#5d6470" strokeWidth={tread === "wet" ? 5 : 3} strokeDasharray={tread === "wet" ? "3 4.3" : "2 7.74"} />
      )}
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="5" strokeDasharray="89.4 30" strokeDashoffset="-15" />
      <circle cx="50" cy="50" r="30" fill="#2a2e36" stroke="#59606c" strokeWidth="1.5" />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M50 34 L48.5 21 L51.5 21 Z" fill="#8b93a1" transform={`rotate(${i * 36} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="17" fill="#16181c" />
      <text x="50" y="50" dy="0.36em" textAnchor="middle" fontSize="17" fontWeight="700" fill={color}>{label}</text>
    </svg>
  );
}

export function TyreBanner() {
  return (
    <section aria-labelledby="neumaticos" className="tyre-banner mt-10 bg-panel">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="neumaticos" className="text-2xl font-semibold tracking-tight">Neumáticos 2026</h2>
          <p className="text-sm text-muted">Pirelli, llanta de 18 pulgadas</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {tyres.map((t, i) => (
            <li key={t.id} style={{ "--i": i } as CSSProperties}>
              <div className="tyre-travel"><div className="tyre-spin"><TyreIcon label={t.label} color={t.color} tread={t.tread} className="mx-auto w-full max-w-32" /></div></div>
              <div className="tyre-info mt-4">
                <h3 className="font-semibold" style={{ color: t.color }}>{t.id.startsWith("C") ? `${t.id}, ${t.name.toLowerCase()}` : t.name}</h3>
                <p className="mt-1 text-sm text-muted">{t.spec}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-muted">
          En cada Gran Premio se usan tres compuestos de seco, marcados según su rol: {roles.map((r, i) => <span key={r.name}>{i > 0 && (i === 2 ? " y " : ", ")}<strong style={{ color: r.color }}>{r.name.toLowerCase()}</strong></span>)}. Frente a 2025, la banda de rodadura es 25 mm más angosta adelante y 30 mm atrás; el diámetro baja 15 y 10 mm.
        </p>
      </div>
    </section>
  );
}

export function RaceTyres({ compounds }: { compounds: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-8">
      {compounds.map((id, i) => (
        <li key={id} className="flex items-center gap-3">
          <TyreIcon label={id} color={roles[i].color} className="w-16" />
          <span><span className="block font-medium" style={{ color: roles[i].color }}>{roles[i].name}</span><span className="text-sm text-muted">{id}</span></span>
        </li>
      ))}
    </ul>
  );
}
