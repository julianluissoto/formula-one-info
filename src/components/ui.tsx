import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { DriverPhoto } from "@/components/driver-photo";
import { FavStar } from "@/components/favorite";
import { getTeam } from "@/data/teams";
import type { Driver, Team } from "@/data/types";

const thBase = "px-3 py-3 text-xs font-bold text-muted uppercase whitespace-nowrap";
const tdBase = "px-3 py-2 tabular-nums border-t border-line align-top";
export const th = `${thBase} text-left`;
export const thNum = `${thBase} text-right`;
export const td = `${tdBase} text-left`;
export const tdNum = `${tdBase} text-right`;
export const champion = " font-semibold text-signal";

export const formatDate = (iso: string) => iso.split("-").reverse().join("/");
export const formatPos = (p?: string | null) => (p ? `${p}º` : "NC");
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
export const roleLabel = { titular: "Titular", reserva: "Reserva", desarrollo: "Desarrollo", reemplazo: "Reemplazo" } as const;

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-14 min-w-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {aside && <p className="text-sm text-muted">{aside}</p>}
      </div>
      {children}
    </section>
  );
}

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto rounded-md bg-panel">
    <table className="w-full text-sm">{children}</table>
  </div>
);

export function TeamBadge({ team }: { team: Team }) {
  return (
    <Link href={`/escuderias/${team.slug}`} className="inline-flex items-center gap-2 whitespace-nowrap hover:underline">
      <span aria-hidden className="h-3.5 w-1.5 shrink-0" style={{ background: team.color }} />
      {team.name}
    </Link>
  );
}

export const TeamBadges = ({ slugs }: { slugs: string[] }) => (
  <span className="inline-flex flex-wrap gap-x-4">
    {slugs.map((s) => {
      const t = getTeam(s);
      return t && <TeamBadge key={s} team={t} />;
    })}
  </span>
);

export function DriverName({ name }: { name: string }) {
  const [first, ...rest] = name.split(" ");
  return <>{first} <b className="block font-extrabold">{rest.join(" ")}</b></>;
}

export function DriverRow({ driver }: { driver: Driver }) {
  const team = getTeam(driver.teams[0]);
  return (
    <Link href={`/pilotos/${driver.slug}`} className="team-grad flex min-h-60 rounded-md p-4 transition-[filter] hover:brightness-115" style={{ "--team": team?.color } as CSSProperties}>
      <DriverPhoto slug={driver.slug} name="" className="fade-left !absolute inset-y-0 right-0 -z-1 w-[45%]" sizes="(min-width: 1024px) 270px, 50vw" />
      <span className="max-w-[58%] min-w-0">
        <span className="wide block text-lg leading-tight"><DriverName name={driver.name} /></span>
        <span className="mt-1 block text-sm font-semibold">
          {driver.teams.map((s) => getTeam(s)?.name).join(" y ")}
          {driver.role !== "titular" && `, ${driver.role}`}
        </span>
        {driver.number !== null && <span className="wide mt-2 block text-4xl font-black italic tabular-nums">{driver.number}</span>}
        <span className="mt-2 block text-sm">{driver.nationality}<FavStar href={`/pilotos/${driver.slug}`} /></span>
      </span>
    </Link>
  );
}

export function Facts({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-sm text-muted">{k}</dt>
          <dd className="mt-0.5 font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export const Notice = ({ children }: { children: ReactNode }) => (
  <p className="rounded-md bg-panel px-4 py-3 text-sm text-muted">{children}</p>
);

export const ApiNotice = () => <Notice>No pudimos traer los datos en vivo. Probá de nuevo en unos minutos.</Notice>;

export const Skeleton = () => <div aria-hidden className="h-64 animate-pulse rounded-md bg-panel motion-reduce:animate-none" />;
