import type { Team, TeamNameEra } from "./types";

const era = (name: string, from: number, to: number | null, ...jolpicaIds: string[]): TeamNameEra => ({ name, from, to, jolpicaIds });

// Chasis y unidades de potencia: lista de inscriptos 2026 (Wikipedia, 25/11/2026).
export const teams: Team[] = [
  { slug: "mercedes", jolpicaId: "mercedes", name: "Mercedes", fullName: "Mercedes-AMG Petronas F1 Team", base: "Brackley, Reino Unido", chassis: "F1 W17", powerUnit: "Mercedes-AMG F1 M17", color: "#27d8c4",
    eras: [era("Tyrrell", 1970, 1998, "tyrrell"), era("BAR", 1999, 2005, "bar"), era("Honda", 2006, 2008, "honda"), era("Brawn GP", 2009, 2009, "brawn"), era("Mercedes", 2010, null, "mercedes")] },
  { slug: "ferrari", jolpicaId: "ferrari", name: "Ferrari", fullName: "Scuderia Ferrari HP", base: "Maranello, Italia", chassis: "SF-26", powerUnit: "Ferrari 067/6", color: "#f0323f",
    eras: [era("Ferrari", 1950, null, "ferrari")] },
  { slug: "red-bull", jolpicaId: "red_bull", name: "Red Bull", fullName: "Oracle Red Bull Racing", base: "Milton Keynes, Reino Unido", chassis: "RB22", powerUnit: "Red Bull Ford DM01", color: "#5b86de",
    eras: [era("Stewart", 1997, 1999, "stewart"), era("Jaguar", 2000, 2004, "jaguar"), era("Red Bull", 2005, null, "red_bull")] },
  { slug: "mclaren", jolpicaId: "mclaren", name: "McLaren", fullName: "McLaren Mastercard F1 Team", base: "Woking, Reino Unido", chassis: "MCL40", powerUnit: "Mercedes-AMG F1 M17", color: "#ff8a1f",
    eras: [era("McLaren", 1966, null, "mclaren", "mclaren-ford")] },
  { slug: "racing-bulls", jolpicaId: "rb", name: "Racing Bulls", fullName: "Visa Cash App Racing Bulls F1 Team", base: "Faenza, Italia", chassis: "VCARB 03", powerUnit: "Red Bull Ford DM01", color: "#8ea6ff",
    eras: [era("Minardi", 1985, 2005, "minardi"), era("Toro Rosso", 2006, 2019, "toro_rosso"), era("AlphaTauri", 2020, 2023, "alphatauri"), era("RB", 2024, 2024, "rb"), era("Racing Bulls", 2025, null, "rb")] },
  { slug: "alpine", jolpicaId: "alpine", name: "Alpine", fullName: "BWT Alpine F1 Team", base: "Enstone, Reino Unido", chassis: "A526", powerUnit: "Mercedes-AMG F1 M17", color: "#1fa6ea",
    eras: [era("Toleman", 1981, 1985, "toleman"), era("Benetton", 1986, 2001, "benetton"), era("Renault", 2002, 2011, "renault"), era("Lotus F1", 2012, 2015, "lotus_f1"), era("Renault", 2016, 2020, "renault"), era("Alpine", 2021, null, "alpine")] },
  { slug: "haas", jolpicaId: "haas", name: "Haas", fullName: "TGR Haas F1 Team", base: "Kannapolis, Estados Unidos", chassis: "VF-26", powerUnit: "Ferrari 067/6", color: "#c9ced6",
    eras: [era("Haas", 2016, null, "haas")] },
  { slug: "audi", jolpicaId: "audi", name: "Audi", fullName: "Audi Revolut F1 Team", base: "Hinwil, Suiza", chassis: "R26", powerUnit: "Audi AFR 26 Hybrid", color: "#f0603c",
    eras: [era("Sauber", 1993, 2005, "sauber"), era("BMW Sauber", 2006, 2009, "bmw_sauber"), era("Sauber", 2010, 2018, "sauber"), era("Alfa Romeo", 2019, 2023, "alfa"), era("Kick Sauber", 2024, 2025, "sauber"), era("Audi", 2026, null, "audi")] },
  { slug: "williams", jolpicaId: "williams", name: "Williams", fullName: "Atlassian Williams F1 Team", base: "Grove, Reino Unido", chassis: "FW48", powerUnit: "Mercedes-AMG F1 M17", color: "#3f86ff",
    eras: [era("Williams", 1977, null, "williams")] },
  { slug: "aston-martin", jolpicaId: "aston_martin", name: "Aston Martin", fullName: "Aston Martin Aramco F1 Team", base: "Silverstone, Reino Unido", chassis: "AMR26", powerUnit: "Honda RA626H", color: "#2ba678",
    eras: [era("Jordan", 1991, 2005, "jordan"), era("Midland", 2006, 2006, "mf1", "spyker_mf1"), era("Spyker", 2007, 2007, "spyker"), era("Force India", 2008, 2018, "force_india"), era("Racing Point", 2019, 2020, "racing_point"), era("Aston Martin", 2021, null, "aston_martin")] },
  { slug: "cadillac", jolpicaId: "cadillac", name: "Cadillac", fullName: "Cadillac Formula 1 Team", base: "Fishers, Estados Unidos", chassis: "MAC-26", powerUnit: "Ferrari 067/6", color: "#e0c27a",
    eras: [era("Cadillac", 2026, null, "cadillac")] },
];

export const getTeam = (slug: string) => teams.find((t) => t.slug === slug);
export const getTeamByJolpicaId = (id: string) => teams.find((t) => t.jolpicaId === id);
