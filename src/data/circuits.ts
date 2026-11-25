import type { Circuit } from "./types";

const c = (
  round: number, date: string, sprint: boolean, gp: string, slug: string, name: string, place: string, country: string, kind: string, since: number,
  km: number, turns: number, laps: number, raceKm: number, record: [string, string, number], tyres: Circuit["tyres"],
): Circuit => ({ round, date, sprint, gp, slug, name, place, country, kind, since, km, turns, laps, raceKm, record, tyres });

const permanente = "Permanente";
const callejero = "Callejero";
const semi = "Semipermanente";
const soft: Circuit["tyres"] = ["C3", "C4", "C5"];
const mid: Circuit["tyres"] = ["C2", "C3", "C4"];
const hard: Circuit["tyres"] = ["C1", "C2", "C3"];

// Calendario: Jolpica. Trazado, récords y compuestos: Wikipedia (artículos de cada circuito y GP, 25/11/2026).
// Récord = vuelta rápida en carrera con el trazado actual. Abu Dhabi: compuestos 2026 sin confirmar en las fuentes.
export const circuits: Circuit[] = [
  c(1, "2026-03-08", false, "Australia", "albert-park", "Albert Park", "Melbourne", "Australia", callejero, 1953, 5.278, 14, 58, 306.124, ["1:19.813", "Charles Leclerc", 2024], soft),
  c(2, "2026-03-15", true, "China", "shanghai", "Circuito Internacional de Shanghái", "Shanghái", "China", permanente, 2004, 5.451, 16, 56, 305.066, ["1:32.238", "Michael Schumacher", 2004], mid),
  c(3, "2026-03-29", false, "Japón", "suzuka", "Suzuka", "Suzuka", "Japón", permanente, 1962, 5.807, 18, 53, 307.471, ["1:30.965", "Kimi Antonelli", 2025], hard),
  c(4, "2026-05-03", true, "Miami", "miami", "Autódromo Internacional de Miami", "Miami Gardens", "Estados Unidos", semi, 2022, 5.412, 19, 57, 308.326, ["1:29.708", "Max Verstappen", 2023], soft),
  c(5, "2026-05-24", true, "Canadá", "gilles-villeneuve", "Circuito Gilles Villeneuve", "Montreal", "Canadá", semi, 1978, 4.361, 14, 68, 296.548, ["1:13.078", "Valtteri Bottas", 2019], soft),
  c(6, "2026-06-07", false, "Mónaco", "monaco", "Circuito de Mónaco", "Montecarlo", "Mónaco", callejero, 1929, 3.337, 19, 78, 260.286, ["1:12.909", "Lewis Hamilton", 2021], soft),
  c(7, "2026-06-14", false, "Barcelona", "barcelona", "Circuito de Barcelona-Cataluña", "Montmeló", "España", permanente, 1991, 4.657, 14, 66, 307.236, ["1:15.743", "Oscar Piastri", 2025], mid),
  c(8, "2026-06-28", false, "Austria", "red-bull-ring", "Red Bull Ring", "Spielberg", "Austria", permanente, 1969, 4.326, 10, 71, 307.026, ["1:07.924", "Oscar Piastri", 2025], soft),
  c(9, "2026-07-05", true, "Gran Bretaña", "silverstone", "Silverstone", "Silverstone", "Reino Unido", permanente, 1948, 5.891, 18, 52, 306.198, ["1:27.097", "Max Verstappen", 2020], hard),
  c(10, "2026-07-19", false, "Bélgica", "spa", "Spa-Francorchamps", "Stavelot", "Bélgica", permanente, 1921, 7.004, 19, 44, 308.054, ["1:44.701", "Sergio Pérez", 2024], mid),
  c(11, "2026-07-26", false, "Hungría", "hungaroring", "Hungaroring", "Mogyoród", "Hungría", permanente, 1986, 4.381, 14, 70, 306.63, ["1:16.627", "Lewis Hamilton", 2020], soft),
  c(12, "2026-08-23", true, "Países Bajos", "zandvoort", "Zandvoort", "Zandvoort", "Países Bajos", permanente, 1948, 4.259, 14, 72, 306.592, ["1:11.097", "Lewis Hamilton", 2021], mid),
  c(13, "2026-09-06", false, "Italia", "monza", "Monza", "Monza", "Italia", permanente, 1922, 5.793, 11, 53, 306.72, ["1:20.901", "Lando Norris", 2025], soft),
  c(14, "2026-09-13", false, "España", "madring", "Madring", "Madrid", "España", callejero, 2026, 5.414, 22, 57, 308.399, ["1:35.587", "George Russell", 2026], mid),
  c(15, "2026-09-26", false, "Azerbaiyán", "baku", "Circuito de Bakú", "Bakú", "Azerbaiyán", callejero, 2016, 6.003, 20, 51, 306.042, ["1:43.009", "Charles Leclerc", 2019], soft),
  c(16, "2026-10-04", false, "Baréin en Malasia", "sepang", "Circuito Internacional de Sepang", "Sepang", "Malasia", permanente, 1999, 5.543, 15, 55, 304.874, ["1:34.080", "Sebastian Vettel", 2017], mid),
  c(17, "2026-10-11", true, "Singapur", "marina-bay", "Marina Bay", "Singapur", "Singapur", callejero, 2008, 4.927, 19, 62, 305.337, ["1:33.808", "Lewis Hamilton", 2025], soft),
  c(18, "2026-10-25", false, "Estados Unidos", "austin", "Circuito de las Américas", "Austin", "Estados Unidos", permanente, 2012, 5.513, 20, 56, 308.432, ["1:36.169", "Charles Leclerc", 2019], mid),
  c(19, "2026-11-01", false, "Ciudad de México", "hermanos-rodriguez", "Autódromo Hermanos Rodríguez", "Ciudad de México", "México", permanente, 1959, 4.304, 17, 71, 305.584, ["1:17.774", "Valtteri Bottas", 2021], soft),
  c(20, "2026-11-08", false, "Brasil", "interlagos", "Autódromo José Carlos Pace (Interlagos)", "San Pablo", "Brasil", permanente, 1940, 4.309, 15, 71, 305.879, ["1:10.540", "Valtteri Bottas", 2018], soft),
  c(21, "2026-11-22", false, "Las Vegas", "las-vegas", "Las Vegas Strip", "Las Vegas", "Estados Unidos", callejero, 2023, 6.201, 17, 50, 309.958, ["1:33.365", "Max Verstappen", 2025], soft),
  c(22, "2026-11-29", false, "Catar", "lusail", "Circuito Internacional de Lusail", "Lusail", "Catar", permanente, 2004, 5.419, 16, 57, 308.611, ["1:22.384", "Lando Norris", 2024], hard),
  c(23, "2026-12-06", false, "Abu Dabi", "yas-marina", "Yas Marina", "Abu Dabi", "Emiratos Árabes Unidos", permanente, 2009, 5.281, 16, 58, 306.183, ["1:25.637", "Kevin Magnussen", 2024], null),
];

export const getCircuit = (slug: string) => circuits.find((x) => x.slug === slug);
