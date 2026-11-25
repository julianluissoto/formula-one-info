import type { Metadata } from "next";
import { Compare, type CompareDriver } from "@/components/compare";
import { hasPhoto } from "@/components/driver-photo";
import { drivers } from "@/data/drivers";
import { played, pointsByRound } from "@/data/season";
import { getTeam } from "@/data/teams";

export const metadata: Metadata = { title: "Comparar pilotos" };

export default function Page() {
  const list: CompareDriver[] = pointsByRound().flatMap(({ id }) => {
    const d = drivers.find((x) => x.jolpicaId === id);
    if (!d) return [];
    const team = getTeam(d.teams[0])!;
    return [{
      slug: d.slug, name: d.name, team: team.name, color: team.color, photo: hasPhoto(d.slug),
      rounds: played.map((r): CompareDriver["rounds"][number] => {
        const x = r.results.find((y) => y.d === id);
        if (!x) return null;
        return [x.pos, r.quali.find((y) => y.d === id)?.pos ?? null, x.pts + (r.sprint.find((y) => y.d === id)?.pts ?? 0), /^\d+$/.test(x.text)];
      }),
    }];
  });
  return (
    <>
      <h1 className="text-5xl font-semibold tracking-tight">Comparar pilotos</h1>
      <p className="mt-4 text-lg text-muted">Temporada 2026, tras la ronda {played.at(-1)?.round}.</p>
      <Compare drivers={list} />
    </>
  );
}
