import { circuits } from "./circuits";
import { getDriverByJolpicaId } from "./drivers";
import seasonJson from "./season.json";

// Instantánea generada con `npm run datos`.
export type RaceRow = { d: string; t: string; pos: number; text: string; grid: number; pts: number; time: string | null; fl: string | null; flRank: number };
export type QualiRow = { d: string; t: string; pos: number; q1: string | null; q2: string | null; q3: string | null };
export type Session = { name: string; at: string };
export type Round = { round: number; date: string; sessions: Session[]; results: RaceRow[]; quali: QualiRow[]; sprint: RaceRow[] };

const data = seasonJson as { season: number; names: Record<string, string>; rounds: Round[] };

export const seasonYear = data.season;
export const rounds = data.rounds;
export const played = rounds.filter((r) => r.results.length > 0);
export const getRound = (n: number) => rounds.find((r) => r.round === n);
export const driverName = (id: string) => getDriverByJolpicaId(id)?.name ?? data.names[id] ?? id;

export type DriverSeasonLine = { id: string; slug: string | null; name: string; total: number; cumulative: number[] };

/** Puntos acumulados (carrera + sprint) tras cada ronda, de mayor a menor. */
export function pointsByRound(): DriverSeasonLine[] {
  const ids = [...new Set(played.flatMap((r) => [...r.results, ...r.sprint].map((x) => x.d)))];
  return ids
    .map((id) => {
      let sum = 0;
      const cumulative = played.map((r) => (sum += [...r.results, ...r.sprint].filter((x) => x.d === id).reduce((a, x) => a + x.pts, 0)));
      return { id, slug: getDriverByJolpicaId(id)?.slug ?? null, name: driverName(id), total: sum, cumulative };
    })
    .sort((a, b) => b.total - a.total);
}

export const roundLabels = played.map((r) => circuits.find((c) => c.round === r.round)?.gp ?? `Ronda ${r.round}`);
