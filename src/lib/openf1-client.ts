// Cliente de OpenF1 (https://openf1.org), compartido por todo el sitio.
// Gratis: sesiones terminadas, 3 req/s y 30 req/min. Durante una sesión en vivo
// bloquea el acceso gratuito (responde 401) hasta que termina.
// Con la suscripción, cargar OPENF1_USERNAME y OPENF1_PASSWORD en el entorno:
// se pide un token OAuth2 (dura 1 hora) y se habilitan los datos en vivo.

const BASE = "https://api.openf1.org";
const UA = "personal-f1-app/1.0.0";

export const hasLiveAccess = () => !!(process.env.OPENF1_USERNAME && process.env.OPENF1_PASSWORD);

let token: { value: string; until: number } | null = null;

async function getToken() {
  if (!hasLiveAccess()) return null;
  if (token && token.until > Date.now()) return token.value;
  const res = await fetch(`${BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
    body: new URLSearchParams({ username: process.env.OPENF1_USERNAME!, password: process.env.OPENF1_PASSWORD! }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`token HTTP ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: string | number };
  token = { value: data.access_token, until: Date.now() + (Number(data.expires_in) - 300) * 1000 };
  return token.value;
}

// Cola propia que respeta los límites: gratis 3/s y 30/min; con suscripción 6/s y 60/min.
let queue: Promise<unknown> = Promise.resolve();
const recent: number[] = [];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function slot() {
  const [perMinute, gap] = hasLiveAccess() ? [55, 200] : [28, 400]; // un margen bajo el límite
  for (;;) {
    const now = Date.now();
    while (recent.length && recent[0] < now - 60_000) recent.shift();
    const last = recent.at(-1) ?? 0;
    if (recent.length < perMinute && now - last >= gap) break;
    await sleep(recent.length >= perMinute ? recent[0] + 60_000 - now : gap - (now - last));
  }
  recent.push(Date.now());
}
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(slot).then(fn);
  queue = run.catch(() => {});
  return run;
}

export class OpenF1Error extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** GET a /v1. Lanza OpenF1Error; un 401 sin suscripción indica que hay una sesión en vivo. */
export async function openf1<T>(path: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await throttled(async () => {
      const auth = await getToken();
      return fetch(`${BASE}/v1${path}`, {
        headers: { "User-Agent": UA, accept: "application/json", ...(auth && { Authorization: `Bearer ${auth}` }) },
        signal: AbortSignal.timeout(20_000),
      });
    });
    // El límite es por IP: si otra instancia o un reinicio lo agotó, se espera y se reintenta.
    if (res.status === 429 && attempt < 3) {
      await sleep(Math.min(30, Number(res.headers.get("retry-after")) || 5 * (attempt + 1)) * 1000);
      continue;
    }
    if (!res.ok) throw new OpenF1Error(res.status, `OpenF1 ${path}: HTTP ${res.status}`);
    return (await res.json()) as T;
  }
}

/** Igual que `openf1`, pero devuelve null si falla (y lo registra). */
export async function openf1OrNull<T>(path: string): Promise<T | null> {
  try {
    return await openf1<T>(path);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return null;
  }
}
