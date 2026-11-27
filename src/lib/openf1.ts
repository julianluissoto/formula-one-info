import { cacheLife } from "next/cache";
import { drivers } from "@/data/drivers";
import { getTeam } from "@/data/teams";
import { throttled } from "./throttle";

// OpenF1: datos por sesión (prácticas incluidas). Sin API key, pero mientras hay
// una sesión en vivo bloquea todo el acceso gratuito hasta que termina.
const BASE = "https://api.openf1.org/v1";
const HEADERS = { "User-Agent": "personal-f1-app/1.0.0" };
const HOUR = 3_600_000;

type ApiSession = { session_key: number; session_name: string; date_start: string; date_end: string };
type ApiResult = { driver_number: number; duration: number | (number | null)[] | null; position: number | null };
type ApiLap = { driver_number: number; lap_duration: number | null };
type ApiDriver = { driver_number: number; full_name: string; team_name: string | null; team_colour: string | null };

export type SessionBest = { time: string; driver: string; slug: string | null; team: string; color: string };
/** Mejor vuelta de cada sesión, con la hora de inicio de la sesión como clave. */
export type SessionBests = Record<string, SessionBest | null>;

async function get<T>(path: string): Promise<T | null> {
  try {
    return await throttled(async () => {
      const res = await fetch(BASE + path, { headers: HEADERS, signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    });
  } catch (e) {
    console.error("OpenF1:", path, e instanceof Error ? e.message : e);
    return null;
  }
}

/** 83.456 → "1:23.456" */
const lapTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, "0")}`;

const title = (name: string) => name.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());

async function best(session: ApiSession): Promise<SessionBest | null | undefined> {
  const isRace = /^(Race|Sprint)$/.test(session.session_name);
  let number: number, seconds: number;
  if (isRace) {
    // En carrera, session_result trae el tiempo total: la vuelta rápida sale de las vueltas.
    const laps = await get<ApiLap[]>(`/laps?session_key=${session.session_key}&lap_duration>0`);
    if (!laps) return undefined;
    const top = laps.reduce<ApiLap | null>((a, l) => (l.lap_duration && (!a || l.lap_duration < a.lap_duration!) ? l : a), null);
    if (!top) return null;
    [number, seconds] = [top.driver_number, top.lap_duration!];
  } else {
    // En prácticas es la mejor vuelta; en clasificación, una lista con Q1, Q2 y Q3.
    const rows = await get<ApiResult[]>(`/session_result?session_key=${session.session_key}`);
    if (!rows) return undefined;
    const times = rows.flatMap((r) => (Array.isArray(r.duration) ? r.duration : [r.duration]).filter((d): d is number => !!d).map((d) => [r.driver_number, d] as const));
    if (!times.length) return null;
    [number, seconds] = times.reduce((a, t) => (t[1] < a[1] ? t : a));
  }

  const local = drivers.find((d) => d.number === number && d.role === "titular") ?? drivers.find((d) => d.number === number);
  const team = local && getTeam(local.teams[0]);
  if (local && team) return { time: lapTime(seconds), driver: local.name, slug: local.slug, team: team.name, color: team.color };
  const api = (await get<ApiDriver[]>(`/drivers?session_key=${session.session_key}&driver_number=${number}`))?.[0];
  return { time: lapTime(seconds), driver: api ? title(api.full_name) : `#${number}`, slug: null, team: api?.team_name ?? "", color: api?.team_colour ? `#${api.team_colour}` : "#a3aab6" };
}

/**
 * Mejores vueltas de las sesiones ya terminadas de un fin de semana.
 * `sessions` son las del calendario local; se cruzan con OpenF1 por horario.
 */
export async function getSessionBests(sessions: { at: string }[]): Promise<SessionBests> {
  "use cache";
  const now = Date.now();
  const first = Date.parse(sessions[0].at), last = Date.parse(sessions.at(-1)!.at);
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);
  const out: SessionBests = {};
  let complete = true;

  if (now > first) {
    const list = await get<ApiSession[]>(`/sessions?date_start>=${day(first - 24 * HOUR)}&date_start<=${day(last + 24 * HOUR)}`);
    if (!list) complete = false;
    for (const s of sessions) {
      const at = Date.parse(s.at);
      const match = list?.find((x) => Math.abs(Date.parse(x.date_start) - at) < 2 * HOUR);
      if (!match || Date.parse(match.date_end) > now) {
        if (at < now) complete = false; // en curso o recién terminada
        continue;
      }
      const b = await best(match);
      if (b === undefined) complete = false;
      out[s.at] = b ?? null;
    }
  }
  // Con sesiones pendientes de publicar, se vuelve a consultar en minutos.
  if (complete && now > last + 3 * HOUR) cacheLife("days");
  else cacheLife("minutes");
  return out;
}
