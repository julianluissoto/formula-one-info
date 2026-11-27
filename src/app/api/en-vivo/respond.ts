import { failed } from "@/lib/live";

const STATUS = { bloqueado: 503, limite: 429, fallo: 502 } as const;

/** Respuesta JSON; los fallos de OpenF1 llegan como { error } para que la página los explique. */
export async function respond(work: () => Promise<unknown>) {
  try {
    const data = await work();
    return failed(data) ? Response.json(data, { status: STATUS[data.error] }) : Response.json(data);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return Response.json({ error: "fallo" }, { status: 502 });
  }
}
