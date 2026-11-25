export type TeamNameEra = {
  name: string;
  from: number;
  /** null = sigue vigente */
  to: number | null;
  /** Ids de Jolpica: una era puede tener más de uno (ej. Midland en 2006). */
  jolpicaIds: string[];
};

export type Team = {
  slug: string;
  jolpicaId: string;
  name: string;
  fullName: string;
  base: string;
  chassis: string;
  powerUnit: string;
  color: string;
  eras: TeamNameEra[];
};

export type CareerEntry = {
  season: string;
  series: string;
  team: string;
  /** Solo para roles sin carrera (reserva, pruebas…) */
  role?: string;
  races?: number | null;
  wins?: number | null;
  poles?: number | null;
  podiums?: number | null;
  points?: number | null;
  position?: string | null;
};

export type DriverRole = "titular" | "reserva" | "desarrollo" | "reemplazo";

export type Driver = {
  slug: string;
  /** null si la API no lo tiene */
  jolpicaId: string | null;
  name: string;
  number: number | null;
  role: DriverRole;
  teams: string[];
  nationality: string;
  birthDate: string;
  birthPlace: string;
  karting: string;
  note?: string;
  career: CareerEntry[];
};

export type SeasonResult = {
  season: number;
  position: string | null;
  points: number;
  wins: number;
};

export type DriverSeason = SeasonResult & { teams: string[] };

export type Compound = "C1" | "C2" | "C3" | "C4" | "C5";

export type Circuit = {
  round: number;
  date: string;
  sprint: boolean;
  gp: string;
  slug: string;
  name: string;
  place: string;
  country: string;
  kind: string;
  since: number;
  km: number;
  turns: number;
  laps: number;
  raceKm: number;
  /** tiempo, piloto, año */
  record: [string, string, number];
  /** duro, medio, blando; null = sin confirmar */
  tyres: readonly [Compound, Compound, Compound] | null;
};
