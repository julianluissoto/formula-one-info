@AGENTS.md

# CLAUDE.md — F1 Parrilla

Contexto para seguir este proyecto con Claude Code. Leelo completo antes de tocar código.

## Qué es

Web personal de Fórmula 1 (UI en **español rioplatense**) con:
- La **parrilla actual (2026)**: 11 escuderías, 22 titulares y los pilotos **reserva**.
- Una página por **escudería** con su ficha, sus pilotos, la **línea de tiempo de nombres** que tuvo la estructura (ej. Minardi → Toro Rosso → AlphaTauri → RB/Racing Bulls) y su historial en el campeonato de constructores sumando todas esas eras.
- Una página por **piloto** con su ficha, karting, **trayectoria en otras categorías** (F4, Regional, F3, F2, IndyCar, Le Mans…) e historial en F1 temporada por temporada.

## Stack y comandos

- Next.js **16.4** (App Router, Turbopack), React 19, TypeScript, Tailwind v4, fuentes del paquete `geist` (locales, sin Google Fonts).
- `npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`
- Si TypeScript se queja de `PageProps<"/ruta">` / `LayoutProps`, correr `npx next typegen` (los tipos de rutas se generan).

### ⚠️ Next.js 16 es distinto a lo que conocés

`next.config.ts` tiene `cacheComponents: true` y `partialPrefetching: true`. Antes de escribir código de rutas/caché, leé la doc incluida en `node_modules/next/dist/docs/` (ver `AGENTS.md`). Puntos que ya nos mordieron:
- La caché se hace con la directiva **`"use cache"`** + **`cacheLife("hours" | "days" ...)`**, no con `revalidate` ni `fetch(..., { next })`.
- **`dynamicParams = false` NO existe** con Cache Components. Para devolver 404 a slugs desconocidos, la page hace `await props.params` y llama a `notFound()` antes de renderizar (ver `src/app/pilotos/[slug]/page.tsx`).
- Los datos no cacheados o que dependen de la request van dentro de `<Suspense>`.

## Estructura

```
src/
  app/
    page.tsx                    # Parrilla + campeonatos en vivo
    escuderias/page.tsx         # Listado
    escuderias/[slug]/page.tsx  # Ficha, linaje, historial constructores
    pilotos/page.tsx            # Titulares y reservas
    pilotos/[slug]/page.tsx     # Ficha, trayectoria, historial F1
    not-found.tsx, layout.tsx, globals.css
  components/ui.tsx             # Section, TeamBadge, DriverRow, Notice, Skeleton, clases th/td
  data/
    types.ts                    # Team, TeamNameEra, Driver, CareerEntry
    teams.ts                    # 11 equipos + linaje (datos curados)
    drivers.ts                  # titulares + reservas + trayectoria (datos curados)
  lib/
    jolpica.ts                  # cliente API ("use cache")
    throttle.ts                 # cola: 300 ms entre requests
```

## Datos: dos fuentes

### 1. Curados a mano (`src/data/`) — lo que ninguna API trae
- **Reservas**, **trayectoria fuera de la F1**, **karting** y **linaje de nombres** de cada escudería.
- Cada `TeamNameEra` tiene `jolpicaId` para cruzar con la API. Un mismo id puede repetirse en varias eras (ej. `renault` en 2002–2011 y 2016–2020; `sauber` en tres eras); el historial filtra por `from`/`to`.
- Cada `Driver` tiene `jolpicaId` (`null` si nunca corrió un GP, ej. O'Ward, Maini).
- Fuentes usadas (nov. 2026): lista de inscriptos FIA 2026, notas de Motorsport Magazine/F1.com/PlanetF1 sobre reservas, tablas "Career summary" de Wikipedia.

### 2. En vivo: API Jolpica-F1 (reemplazo compatible de Ergast)
- Base: `https://api.jolpi.ca/ergast/f1` (sin API key). Límite ~4 req/s y ~500 req/h; por eso `throttle.ts`.
- **Exige `User-Agent` propio**: con el de Node por defecto responde 403.
- Endpoints usados: `/current/driverstandings`, `/current/constructorstandings` y `/current/last/results` (caché 1 h; si fallan, solo unos minutos).
- `/drivers/{id}/driverstandings` y `/constructors/{id}/constructorstandings` **dan 400**: las posiciones requieren temporada. Por eso las temporadas cerradas están en `src/data/history-*.json`, bajadas de `/{año}/...`. Al cerrar 2026 hay que agregarlas ahí.
- La temporada en curso no suma títulos hasta entrar en esos JSON.
- Toda llamada devuelve `null` si falla y la UI muestra un aviso, sin romper.
- El campeonato de constructores arranca en 1958, así que Ferrari 1950–57 no aparece.

## Estado actual

- `build`, `lint` y `tsc` pasan; probado contra la API real el 25/11/2026 (ronda 21).
- Trayectorias de titulares y reservas en `src/data/careers.json` (Wikipedia, 25/11/2026).
- Cada `TeamNameEra` usa `jolpicaIds` (lista), no `jolpicaId`.
- Un slug desconocido muestra la página "no existe" con `noindex`, pero con status 200 (streaming en Next 16).

### Hechos de 2026 ya reflejados
- Cadillac es el 11º equipo (Pérez, Bottas; reserva Zhou, desarrollo Colton Herta). Sauber pasó a llamarse Audi; Audi no tiene reserva oficial.
- Norris usa el #1 (campeón 2025) y Verstappen el #3.
- Ocon no corre desde la ronda 19 (México): lo reemplazaron Hirakawa (19) y Câmara (20 y 21).
- Hadjar se lesionó: Lawson lo reemplazó en Red Bull y Tsunoda subió a Racing Bulls (rondas 12–14). En `drivers.ts` se mantiene la alineación oficial; los reemplazos aparecen solos en el historial que trae la API.

## Pendientes (por prioridad)

1. Karting de Browning y Maini (sin datos).
2. Logos e imágenes con licencia propia o libre (no copiar assets de F1.com).
3. Calendario (`/current.json`), circuitos y resultados por carrera.
4. Pasar `src/data` a una base de datos con panel de admin.

## Convenciones

- Textos de la UI en español; posiciones como `1º`, `NC`; fechas `dd/mm/aaaa`.
- Slugs en kebab-case (`franco-colapinto`, `racing-bulls`); los ids de Jolpica se guardan aparte.
- Si cambian datos del mundo real (fichajes, reservas, nombres), **buscalos en la web y citá la fuente en el commit**: no inventes datos.
- Sé respetuoso con Jolpica: no agregues llamadas en loops sin pasar por `throttled()` y `"use cache"`.
