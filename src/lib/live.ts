import { cacheLife } from "next/cache";
import { drivers as localDrivers } from "@/data/drivers";
import { getTeam } from "@/data/teams";
import { CHUNK_MS, type ControlRow, type LapRow, type LiveBase, type LiveChunk, type LiveSessionInfo, type PitRow, type PositionRow, type SessionListItem, type StintRow, type WeatherRow } from "./live-types";
import { openf1, OpenF1Error } from "./openf1-client";

type ApiSession = { session_key: number; session_name: string; session_type: string; date_start: string; date_end: string; country_name: string; circuit_short_name: string; year: number };
type ApiDriver = { driver_number: number; name_acronym: string; full_name: string; broadcast_name: string; team_name: string | null; team_colour: string | null };
type ApiLap = { driver_number: number; lap_number: number; date_start: string | null; lap_duration: number | null; duration_sector_1: number | null; duration_sector_2: number | null; duration_sector_3: number | null; st_speed: number | null; is_pit_out_lap: boolean };
type ApiStint = { driver_number: number; compound: string | null; lap_start: number; lap_end: number | null; tyre_age_at_start: number | null };
type ApiPit = { driver_number: number; lap_number: number; date: string; lane_duration?: number | null; pit_duration?: number | null };
type ApiPosition = { date: string; driver_number: number; position: number };
type ApiControl = { date: string; category: string; flag: string | null; scope: string | null; sector: number | null; driver_number: number | null; message: string; lap_number: number | null };
type ApiWeather = { date: string; air_temperature: number; track_temperature: number; humidity: number; rainfall: number | boolean; wind_speed: number };
type ApiCar = { date: string; driver_number: number; speed: number };
type ApiLocation = { date: string; driver_number: number; x: number; y: number };
type ApiInterval = { date: string; driver_number: number; gap_to_leader: number | string | null; interval: number | string | null };

const t = (iso: string) => Date.parse(iso);
const iso = (ms: number) => new Date(ms).toISOString();
const title = (s: string) => s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());

const NAMES: Record<string, string> = {
  "Practice 1": "Práctica 1", "Practice 2": "Práctica 2", "Practice 3": "Práctica 3", "Qualifying": "Clasificación",
  "Sprint Qualifying": "Clasificación sprint", "Sprint Shootout": "Clasificación sprint", "Sprint": "Sprint", "Race": "Carrera",
};

function info(s: ApiSession): LiveSessionInfo {
  return { key: s.session_key, name: NAMES[s.session_name] ?? s.session_name, type: s.session_type, start: t(s.date_start), end: t(s.date_end), country: s.country_name, circuit: s.circuit_short_name, year: s.year };
}

/** Margen para considerar cerrada una sesión: los datos se completan unos minutos después. */
const SETTLE = 30 * 60_000;

async function loadSessionList(year: number): Promise<SessionListItem[]> {
  const list = await openf1<ApiSession[]>(`/sessions?year=${year}`);
  const now = Date.now();
  return list.map(info).filter((s) => s.start < now).map((s) => ({ ...s, finished: s.end + SETTLE < now })).sort((a, b) => b.start - a.start);
}

/** Cache larga si la sesión ya cerró; corta si está en curso (modo en vivo). */
function lifetime(end: number) {
  if (end + SETTLE < Date.now()) cacheLife("weeks");
  else cacheLife({ stale: 0, revalidate: 5, expire: 60 });
}

/** Los errores no cruzan la caché con su tipo: se devuelven como dato y duran segundos. */
export type LiveFailure = { error: "bloqueado" | "limite" | "fallo" };
function failure(e: unknown): LiveFailure {
  console.error(e instanceof Error ? e.message : e);
  cacheLife("seconds");
  return { error: e instanceof OpenF1Error && e.status === 401 ? "bloqueado" : e instanceof OpenF1Error && e.status === 429 ? "limite" : "fallo" };
}
export const failed = (x: unknown): x is LiveFailure => !!x && typeof x === "object" && "error" in x;

export async function getSessionList(year: number): Promise<SessionListItem[] | LiveFailure> {
  "use cache";
  try {
    const r = await loadSessionList(year);
    cacheLife("minutes");
    return r;
  } catch (e) {
    return failure(e);
  }
}

export async function getSessionInfo(key: number): Promise<LiveSessionInfo | null | LiveFailure> {
  "use cache";
  try {
    const [session] = await openf1<ApiSession[]>(`/sessions?session_key=${key}`);
    cacheLife("hours");
    return session ? info(session) : null;
  } catch (e) {
    return failure(e);
  }
}

export async function getLiveBase(s: LiveSessionInfo): Promise<LiveBase | LiveFailure> {
  "use cache";
  try {
    const r = await loadLiveBase(s);
    lifetime(s.end);
    return r;
  } catch (e) {
    return failure(e);
  }
}

export async function getLiveChunk(s: LiveSessionInfo, index: number): Promise<LiveChunk | LiveFailure> {
  "use cache";
  try {
    const r = await loadLiveChunk(s, index);
    lifetime(Math.min(s.end, r.to));
    return r;
  } catch (e) {
    return failure(e);
  }
}

async function loadLiveBase(s: LiveSessionInfo): Promise<LiveBase> {
  const q = `?session_key=${s.key}`;

  const apiDrivers = await openf1<ApiDriver[]>(`/drivers${q}`);
  const laps = await openf1<ApiLap[]>(`/laps${q}`);
  const stints = await openf1<ApiStint[]>(`/stints${q}`);
  const pits = await openf1<ApiPit[]>(`/pit${q}`);
  const positions = await openf1<ApiPosition[]>(`/position${q}`);
  const control = await openf1<ApiControl[]>(`/race_control${q}`);
  const weather = await openf1<ApiWeather[]>(`/weather${q}`);

  // Trazado: la vuelta válida más rápida (sin salida de boxes) de cualquier piloto.
  const ref = laps.filter((l) => l.lap_duration && l.date_start && !l.is_pit_out_lap).sort((a, b) => a.lap_duration! - b.lap_duration!)[0];
  let outline: [number, number][] = [];
  if (ref) {
    const from = t(ref.date_start!);
    const pts = await openf1<ApiLocation[]>(`/location${q}&driver_number=${ref.driver_number}&date>=${iso(from)}&date<${iso(from + ref.lap_duration! * 1000 + 1500)}`);
    outline = pts.filter((p) => p.x || p.y).map((p) => [p.x, p.y]);
  }

  return {
    session: s,
    drivers: apiDrivers.map((d) => {
      const local = localDrivers.find((x) => x.number === d.driver_number && x.role === "titular") ?? localDrivers.find((x) => x.number === d.driver_number);
      const team = local ? getTeam(local.teams[0]) : undefined;
      return {
        n: d.driver_number,
        code: d.name_acronym,
        name: local?.name ?? title(d.full_name),
        team: d.team_name ?? team?.name ?? "",
        color: d.team_colour ? `#${d.team_colour}` : team?.color ?? "#a3aab6",
        slug: local?.slug ?? null,
      };
    }),
    laps: laps.filter((l) => l.date_start).map((l): LapRow => [l.driver_number, l.lap_number, t(l.date_start!), l.lap_duration, l.duration_sector_1, l.duration_sector_2, l.duration_sector_3, l.st_speed, !!l.is_pit_out_lap]),
    stints: stints.map((x): StintRow => [x.driver_number, x.compound ?? "?", x.lap_start, x.lap_end, x.tyre_age_at_start ?? 0]),
    pits: pits.map((p): PitRow => [p.driver_number, p.lap_number, t(p.date), p.lane_duration ?? p.pit_duration ?? null]),
    positions: positions.map((p): PositionRow => [t(p.date), p.driver_number, p.position]).sort((a, b) => a[0] - b[0]),
    control: control.map((c): ControlRow => [t(c.date), c.category, c.flag, c.scope, c.sector, c.driver_number, c.message, c.lap_number]).sort((a, b) => a[0] - b[0]),
    weather: weather.map((w): WeatherRow => [t(w.date), w.air_temperature, w.track_temperature, w.humidity, !!w.rainfall, w.wind_speed]).sort((a, b) => a[0] - b[0]),
    outline,
  };
}

/** Velocidad, ubicación y diferencias de todos los autos en un tramo de CHUNK_MS. */
async function loadLiveChunk(s: LiveSessionInfo, index: number): Promise<LiveChunk> {
  const key = s.key;
  const from = s.start + index * CHUNK_MS;
  const to = from + CHUNK_MS;
  const range = `session_key=${key}&date>=${iso(from)}&date<${iso(to)}`;
  const car = await openf1<ApiCar[]>(`/car_data?${range}`);
  const loc = await openf1<ApiLocation[]>(`/location?${range}`);
  const gaps = await openf1<ApiInterval[]>(`/intervals?${range}`).catch(() => [] as ApiInterval[]); // solo existe en carreras

  const out: LiveChunk = { from, to, car: {}, loc: {}, gaps: [] };
  for (const c of car.sort((a, b) => t(a.date) - t(b.date))) (out.car[c.driver_number] ??= []).push(t(c.date), c.speed);
  for (const l of loc.sort((a, b) => t(a.date) - t(b.date))) if (l.x || l.y) (out.loc[l.driver_number] ??= []).push(t(l.date), l.x, l.y);
  out.gaps = gaps.map((g) => [t(g.date), g.driver_number, g.gap_to_leader, g.interval] as LiveChunk["gaps"][number]).sort((a, b) => a[0] - b[0]);
  return out;
}
