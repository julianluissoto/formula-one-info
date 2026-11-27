import type { Metadata } from "next";
import { LiveTiming } from "@/components/live-timing";

export const metadata: Metadata = { title: "En vivo" };

export default function Page() {
  return (
    <>
      <h1>En vivo</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Tiempos, sectores, neumáticos y velocidad de todos los autos, con el mapa del circuito y los mensajes de dirección de carrera.</p>
      <LiveTiming />
    </>
  );
}
