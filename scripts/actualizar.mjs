// Descarga la temporada en curso desde Jolpica: npm run datos
// Si la temporada terminó, también agrega sus posiciones a history-*.json.
import fs from "node:fs";

const BASE = "https://api.jolpi.ca/ergast/f1";
const DATA = new URL("../src/data/", import.meta.url);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, DATA), "utf8"));
const write = (f, o) => fs.writeFileSync(new URL(f, DATA), o);

async function get(path, offset = 0) {
  for (let i = 1; i <= 5; i++) {
    await wait(1000 * i);
    const r = await fetch(`${BASE}${path}.json?limit=100&offset=${offset}`, { headers: { "User-Agent": "personal-f1-app/1.0.0" }, signal: AbortSignal.timeout(15000) });
    if (r.ok) return (await r.json()).MRData;
    if (r.status !== 429 && r.status < 500) throw new Error(`${path}: HTTP ${r.status}`);
    await wait(15000);
  }
  throw new Error(`${path}: sin respuesta`);
}

async function all(path, key) {
  const rounds = {};
  for (let offset = 0, total = 1; offset < total; offset += 100) {
    const d = await get(path, offset);
    total = +d.total;
    for (const r of d.RaceTable.Races) (rounds[r.round] ??= []).push(...r[key]);
  }
  return rounds;
}

const races = (await get("/current")).RaceTable.Races;
const season = +races[0].season;
const results = await all("/current/results", "Results");
const quali = await all("/current/qualifying", "QualifyingResults");
const sprint = await all("/current/sprint", "SprintResults");
const names = {};
const id = (x) => {
  names[x.Driver.driverId] = `${x.Driver.givenName} ${x.Driver.familyName}`;
  return x.Driver.driverId;
};
const race = (x) => ({ d: id(x), t: x.Constructor.constructorId, pos: +x.position, text: x.positionText, grid: +x.grid, pts: +x.points, time: x.Time?.time ?? x.status, fl: x.FastestLap?.Time?.time ?? null, flRank: +(x.FastestLap?.rank ?? 0) });
const sessions = [["FirstPractice", "Práctica 1"], ["SecondPractice", "Práctica 2"], ["ThirdPractice", "Práctica 3"], ["SprintQualifying", "Clasificación sprint"], ["Sprint", "Sprint"], ["Qualifying", "Clasificación"]];

const out = {
  season,
  names,
  rounds: races.map((r) => ({
    round: +r.round,
    date: r.date,
    sessions: [...sessions.filter(([k]) => r[k]?.time).map(([k, name]) => ({ name, at: `${r[k].date}T${r[k].time}` })), { name: "Carrera", at: `${r.date}T${r.time ?? "00:00:00Z"}` }].sort((a, b) => a.at.localeCompare(b.at)),
    results: (results[r.round] ?? []).map(race),
    quali: (quali[r.round] ?? []).map((x) => ({ d: id(x), t: x.Constructor.constructorId, pos: +x.position, q1: x.Q1 || null, q2: x.Q2 || null, q3: x.Q3 || null })),
    sprint: (sprint[r.round] ?? []).map(race),
  })),
};
write("season.json", JSON.stringify(out));
const done = out.rounds.filter((r) => r.results.length).length;
console.log(`Temporada ${season}: ${done} de ${races.length} carreras con resultados.`);

if (done === races.length) {
  const D = (await get("/current/driverstandings")).StandingsTable.StandingsLists[0].DriverStandings;
  const C = (await get("/current/constructorstandings")).StandingsTable.StandingsLists[0].ConstructorStandings;
  const save = (file, rows) => {
    const h = read(file);
    for (const [key, row] of rows) h[key] = [...(h[key] ?? []).filter((x) => x.season !== season), row];
    write(file, "{\n" + Object.entries(h).map(([k, v]) => `${JSON.stringify(k)}: [\n${v.map((x) => "  " + JSON.stringify(x)).join(",\n")}\n]`).join(",\n") + "\n}\n");
  };
  const base = (x) => ({ season, position: x.position ?? null, points: +x.points, wins: +x.wins });
  save("history-drivers.json", D.map((x) => [x.Driver.driverId, { ...base(x), teams: x.Constructors.map((c) => c.name) }]));
  save("history-constructors.json", C.map((x) => [x.Constructor.constructorId, base(x)]));
  console.log("Temporada cerrada: historial actualizado.");
}
