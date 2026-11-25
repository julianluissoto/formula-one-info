import type { Metadata } from "next";
import { Blueprint } from "@/components/blueprint";
import { Section, Table, td, th } from "@/components/ui";
import { parts } from "@/data/car";

export const metadata: Metadata = { title: "El monoplaza 2026" };

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">El monoplaza 2026</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">Motor de combustión, motor eléctrico, batería y medidas del auto con el que se corre esta temporada.</p>
      <Blueprint />

<Section title="Todas las especificaciones">
        <Table>
          <thead><tr><th className={th}>Pieza</th><th className={th}>Dato</th><th className={th}>Valor</th></tr></thead>
          <tbody>{parts.flatMap((p) => p.specs.map(([k, v], i) => (
            <tr key={p.id + k}>{i === 0 && <th scope="rowgroup" rowSpan={p.specs.length} className={`${td} font-medium`}>{p.name}</th>}<td className={`${td} text-muted`}>{k}</td><td className={td}>{v}</td></tr>
          )))}</tbody>
        </Table>
        <p className="mt-4 max-w-3xl text-sm text-muted">El plano es una representación simplificada con las medidas generales de 2026, no el auto de un equipo; la posición de las piezas internas es orientativa. Datos: <a className="underline" href="https://api.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_20_-_2026-08-05.pdf">reglamento técnico de la FIA</a> (edición 20), Formula1.com y Wikipedia.</p>
      </Section>
    </>
  );
}
