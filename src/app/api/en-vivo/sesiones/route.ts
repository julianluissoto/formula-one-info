import { connection } from "next/server";
import { failed, getSessionList } from "@/lib/live";
import { hasLiveAccess } from "@/lib/openf1-client";
import { respond } from "../respond";

export async function GET() {
  await connection();
  return respond(async () => {
    const sessions = await getSessionList(new Date().getUTCFullYear());
    return failed(sessions) ? sessions : { live: hasLiveAccess(), sessions };
  });
}
