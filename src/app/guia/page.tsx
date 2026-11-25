import type { Metadata } from "next";
import Link from "next/link";
import { Section, Table, td, tdNum, th, thNum } from "@/components/ui";

export const metadata: Metadata = { title: "Guía de la F1 2026" };

// Fuentes: guías de Formula1.com sobre 2026 y artículo de la temporada en Wikipedia (25/11/2026).
const terms: [string, string][] = [
  ["Aerodinámica activa", "Los alerones delantero y trasero se mueven. Cerrados dan carga para doblar (modo curva); abiertos reducen la resistencia en las rectas habilitadas (modo recta). Reemplaza al DRS y no exige estar cerca del auto de adelante."],
  ["Modo adelantamiento", "Si un piloto pasa por el punto de detección a menos de un segundo del de adelante, recibe energía eléctrica extra para usar en la vuelta siguiente."],
  ["Boost", "Botón que entrega la potencia máxima, o un perfil definido por el equipo, en cualquier parte de la vuelta."],
  ["Recarga", "La batería se carga al frenar, con acelerador parcial o al levantar el pie. Casi todo lo maneja la electrónica."],
  ["Super clipping", "Recargar la batería con el acelerador a fondo, a costa de velocidad en la recta."],
  ["Unidad de potencia", "Motor V6 turbo de 1,6 litros más un sistema eléctrico. Cerca de la mitad de la potencia es eléctrica, y el combustible es sostenible."],
  ["Autos más chicos", "Distancia entre ejes máxima de 3,4 m (200 mm menos), ancho de 1,9 m (100 mm menos) y peso mínimo de 768 kg."],
  ["Compuesto", "La mezcla de goma del neumático. Más blando agarra más y dura menos."],
  ["Undercut", "Parar antes que el rival para ganarle la posición con neumáticos nuevos."],
  ["Overcut", "Parar después que el rival y ganarle la posición aprovechando la pista libre."],
  ["Auto de seguridad", "Sale a pista ante un peligro: agrupa a los autos y prohíbe adelantar."],
  ["Parque cerrado", "Período en el que los equipos casi no pueden modificar el auto."],
];
const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const sprint = [8, 7, 6, 5, 4, 3, 2, 1];

export default function Page() {
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Guía de la F1 2026</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">Lo necesario para seguir una carrera de esta temporada.</p>

      <Section title="El fin de semana">
        <dl className="max-w-2xl space-y-4">
          <div><dt className="font-medium">Normal</dt><dd className="text-muted">Tres prácticas, clasificación y carrera.</dd></div>
          <div><dt className="font-medium">Con sprint</dt><dd className="text-muted">Una práctica, clasificación sprint, carrera sprint, clasificación y carrera.</dd></div>
          <div><dt className="font-medium">Clasificación</dt><dd className="text-muted">Con 22 autos, quedan afuera seis en Q1 y seis en Q2. Los diez restantes definen la pole en Q3.</dd></div>
        </dl>
      </Section>

      <Section title="Puntos">
        <div className="max-w-md">
          <Table>
            <thead><tr><th className={th}>Posición</th><th className={thNum}>Carrera</th><th className={thNum}>Sprint</th></tr></thead>
            <tbody>{points.map((p, i) => <tr key={i}><td className={td}>{i + 1}º</td><td className={tdNum}>{p}</td><td className={tdNum}>{sprint[i] ?? "–"}</td></tr>)}</tbody>
          </Table>
        </div>
        <p className="mt-3 text-sm text-muted">La vuelta más rápida no da puntos.</p>
      </Section>

      <Section title="Glosario">
        <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {terms.map(([t, d]) => <div key={t}><dt className="font-medium">{t}</dt><dd className="mt-1 text-muted">{d}</dd></div>)}
        </dl>
        <p className="mt-8 text-sm"><Link className="underline" href="/circuitos#neumaticos">Ver los neumáticos 2026</Link></p>
      </Section>
    </>
  );
}
