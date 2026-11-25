import constructorsJson from "./history-constructors.json";
import driversJson from "./history-drivers.json";
import type { DriverSeason, SeasonResult, Team } from "./types";

// Temporadas cerradas (hasta 2025), descargadas de Jolpica: no cambian, así que no se piden en vivo.
const byDriver = driversJson as Record<string, DriverSeason[]>;
const byConstructor = constructorsJson as Record<string, SeasonResult[]>;

export const driverHistory = (id: string | null) => (id ? (byDriver[id] ?? []) : []);

export function teamHistory(team: Team) {
  return team.eras.flatMap((era) =>
    era.jolpicaIds.flatMap((id) =>
      (byConstructor[id] ?? [])
        .filter((s) => s.season >= era.from && s.season <= (era.to ?? Infinity))
        .map((s) => ({ ...s, era: era.name })),
    ),
  );
}
