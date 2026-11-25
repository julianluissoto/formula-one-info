import tracks from "@/data/tracks.json";

const paths: Record<string, string> = tracks;

/** Trazado con el norte arriba. */
export function Track({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const d = paths[slug];
  if (!d) return null;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Trazado de ${name}`} className={className} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} stroke="var(--color-line)" strokeWidth="9" />
      <path d={d} stroke="var(--color-ink)" strokeWidth="3.5" />
    </svg>
  );
}
