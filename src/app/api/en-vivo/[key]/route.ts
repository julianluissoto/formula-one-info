import { failed, getLiveBase, getSessionInfo } from "@/lib/live";
import { respond } from "../respond";

export async function GET(_: Request, ctx: RouteContext<"/api/en-vivo/[key]">) {
  const key = Number((await ctx.params).key);
  if (!Number.isInteger(key)) return Response.json({ error: "sesion" }, { status: 400 });
  return respond(async () => {
    const s = await getSessionInfo(key);
    if (failed(s)) return s;
    if (!s) throw new Error(`Sesión ${key} inexistente`);
    return getLiveBase(s);
  });
}
