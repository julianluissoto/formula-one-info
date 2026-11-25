import { cacheLife } from "next/cache";
import { throttled } from "./throttle";

const BASE = "https://api.jolpi.ca/ergast/f1";
// Jolpica exige un User-Agent propio: con el de Node por defecto responde 403.
const HEADERS = { "User-Agent": "personal-f1-app/1.0.0" };

type ApiDriver = { driverId: string; givenName: string; familyName: string };
type ApiConstructor = { constructorId: string; name: string };
type DriverStanding = { position?: string; points: string; wins: string; Driver: ApiDriver; Constructors: ApiConstructor[] };
type ConstructorStanding = { position?: string; points: string; wins: string; Constructor: ApiConstructor };
type StandingsList = { season: string; round: string; DriverStandings?: DriverStanding[]; ConstructorStandings?: ConstructorStanding[] };
type RaceResult = { Driver: ApiDriver; Constructor: ApiConstructor };
export type Standings = { season: number; round: number; drivers: DriverStanding[]; constructors: ConstructorStanding[] };
export type LastRace = { round: number; date: string; results: RaceResult[] };

async function get<T>(path: string): Promise<T | null> {
  try {
    return await throttled(async () => {
      const res = await fetch(`${BASE}${path}?limit=100`, { headers: HEADERS, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()).MRData as T;
    });
  } catch (e) {
    console.error("Jolpica:", path, e instanceof Error ? e.message : e);
    return null;
  }
}

async function list(kind: "driver" | "constructor") {
  const data = await get<{ StandingsTable: { StandingsLists: StandingsList[] } }>(`/current/${kind}standings.json`);
  return data?.StandingsTable?.StandingsLists?.[0] ?? null;
}

export async function getStandings(): Promise<Standings | null> {
  "use cache";
  const [d, c] = await Promise.all([list("driver"), list("constructor")]);
  if (!d?.DriverStandings || !c?.ConstructorStandings) {
    cacheLife("minutes"); // un fallo no debe quedar cacheado una hora
    return null;
  }
  cacheLife("hours");
  return { season: +d.season, round: +d.round, drivers: d.DriverStandings, constructors: c.ConstructorStandings };
}

export async function getLastRace(): Promise<LastRace | null> {
  "use cache";
  const data = await get<{ RaceTable: { Races: { round: string; date: string; Results: RaceResult[] }[] } }>("/current/last/results.json");
  const race = data?.RaceTable?.Races?.[0];
  if (!race) {
    cacheLife("minutes");
    return null;
  }
  cacheLife("hours");
  return { round: +race.round, date: race.date, results: race.Results };
}
