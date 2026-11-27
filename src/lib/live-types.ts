// Formatos compactos que el servidor arma con OpenF1 para la página /en-vivo.
// Los tiempos son milisegundos desde el 1/1/1970 (Date.parse).

export type LiveSessionInfo = { key: number; name: string; type: string; start: number; end: number; country: string; circuit: string; year: number };

export type LiveDriver = { n: number; code: string; name: string; team: string; color: string; slug: string | null };

/** [piloto, vuelta, inicio, duración s, s1, s2, s3, trampa de velocidad, sale de boxes] */
export type LapRow = [number, number, number, number | null, number | null, number | null, number | null, number | null, boolean];
/** [piloto, compuesto, vuelta inicial, vuelta final, edad al empezar] */
export type StintRow = [number, string, number, number | null, number];
/** [piloto, vuelta, momento, tiempo en el pit lane s] */
export type PitRow = [number, number, number, number | null];
/** [momento, piloto, posición] */
export type PositionRow = [number, number, number];
/** [momento, categoría, bandera, alcance, sector, piloto, mensaje, vuelta] */
export type ControlRow = [number, string, string | null, string | null, number | null, number | null, string, number | null];
/** [momento, aire °C, pista °C, humedad %, lluvia, viento m/s] */
export type WeatherRow = [number, number, number, number, boolean, number];

export type LiveBase = {
  session: LiveSessionInfo;
  drivers: LiveDriver[];
  laps: LapRow[];
  stints: StintRow[];
  pits: PitRow[];
  positions: PositionRow[];
  control: ControlRow[];
  weather: WeatherRow[];
  /** Trazado: puntos x,y de una vuelta rápida. */
  outline: [number, number][];
};

/** Por piloto, muestras planas: momento, velocidad. */
export const CAR_STRIDE = 2;
/** Por piloto, muestras planas: momento, x, y. */
export const LOC_STRIDE = 3;

export type LiveChunk = {
  from: number;
  to: number;
  car: Record<number, number[]>;
  loc: Record<number, number[]>;
  /** [momento, piloto, diferencia con el líder, diferencia con el de adelante]; texto si está a vueltas. */
  gaps: [number, number, number | string | null, number | string | null][];
};

export type SessionListItem = LiveSessionInfo & { finished: boolean };

/** Duración de cada tramo de telemetría que se pide al servidor. */
export const CHUNK_MS = 60_000;
