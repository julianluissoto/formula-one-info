import { failed, getLiveChunk, getSessionInfo } from "@/lib/live";
import { CHUNK_MS } from "@/lib/live-types";
import { respond } from "../../respond";

export async function GET(_: Request, ctx: RouteContext<"/api/en-vivo/[key]/[chunk]">) {
  const params = await ctx.params;
  const key = Number(params.key), index = Number(params.chunk);
  if (!Number.isInteger(key) || !Number.isInteger(index) || index < 0) return Response.json({ error: "tramo" }, { status: 400 });
  return respond(async () => {
    const s = await getSessionInfo(key);
    if (failed(s)) return s;
    if (!s) throw new Error(`Sesión ${key} inexistente`);
    // Hasta 10 minutos de margen después del final programado.
    if (index > Math.ceil((s.end - s.start + 600_000) / CHUNK_MS)) return { from: 0, to: 0, car: {}, loc: {}, gaps: [] };
    return getLiveChunk(s, index);
  });
}
