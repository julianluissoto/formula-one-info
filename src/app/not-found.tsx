import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="text-4xl font-semibold tracking-tight">Esta página no existe</h1>
      <p className="mt-3 text-muted">Puede que el piloto o la escudería no esté en la temporada 2026.</p>
      <Link href="/" className="mt-6 inline-block underline">Volver al inicio</Link>
    </>
  );
}
