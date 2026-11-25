import { circuits } from "./circuits";
import { rounds } from "./season";

/** Carreras sin resultado todavía, con lo mínimo para la franja del encabezado. */
export const upcomingRaces = rounds.filter((r) => !r.results.length).flatMap((r) => {
  const c = circuits.find((x) => x.round === r.round);
  return c ? [{ slug: c.slug, round: r.round, gp: c.gp, from: r.sessions[0].at, to: r.sessions.at(-1)!.at }] : [];
});
