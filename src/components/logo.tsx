/** Una "i" hecha con una curva de pista; el punto es el auto. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="22 2 56 98" aria-hidden className={className} fill="none" strokeLinecap="round">
      <path d="M50 88C34 70 64 62 50 42" stroke="var(--color-line)" strokeWidth="20" />
      <path d="M50 88C34 70 64 62 50 42" stroke="var(--color-ink)" strokeWidth="11" />
      <circle cx="50" cy="15" r="10" fill="var(--color-race)" />
    </svg>
  );
}
