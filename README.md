# F1 Parrilla

Web personal sobre la temporada 2026 de Fórmula 1: escuderías, pilotos, circuitos y neumáticos. Está en español rioplatense.

## Qué incluye

| Ruta | Contenido |
| --- | --- |
| `/` | Próxima carrera con cuenta regresiva, favoritos y parrilla con una card por escudería (pilotos, logo, auto y reservas), reemplazos de la temporada y campeonatos |
| `/escuderias` y `/escuderias/[slug]` | Ficha, pilotos, línea de tiempo de nombres e historial de constructores |
| `/pilotos` y `/pilotos/[slug]` | Ficha, historial en F1 de los últimos 10 años, karting y trayectoria en otras categorías |
| `/circuitos` y `/circuitos/[slug]` | Calendario, trazados, datos técnicos, récords y banner animado de neumáticos |
| `/campeonato` | Gráfico y tabla de puntos por ronda |
| `/comparar` | Dos pilotos frente a frente |
| `/campeones` | Campeones desde 1950 |
| `/guia` | Formato, puntos y glosario 2026 |
| `/buscar` | Buscador con filtros |
| `/creditos` | Autores y licencias de las fotos |

## Cómo correrla

Requiere Node.js 20.9 o superior. No hace falta API key ni variables de entorno.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

| Comando | Para qué |
| --- | --- |
| `npm run build` | Compilar para producción |
| `npm run start` | Servir la versión compilada |
| `npm run datos` | Actualizar resultados y horarios desde Jolpica |
| `npm run lint` | Revisar el código con ESLint |
| `npx tsc --noEmit` | Revisar los tipos |

Si TypeScript no reconoce `PageProps` o `LayoutProps`, corré `npx next typegen`.

## Tecnologías

Next.js 16.4 (App Router y Cache Components), React 19, TypeScript, Tailwind CSS 4 y las fuentes Geist.

## Estructura

```
src/
  app/          rutas y estilos globales
  components/   cards, tablas, neumáticos y trazados
  data/         datos cargados en el proyecto
  lib/          cliente de la API y límite de requests
public/
  autos/        fotos de los autos
  logos/        logos de las escuderías
```

## Datos

**En vivo:** los campeonatos y la última carrera salen de [Jolpica-F1](https://github.com/jolpica/jolpica-f1), con una hora de caché. La API exige un `User-Agent` propio, definido en `src/lib/jolpica.ts`. Si falla, la web muestra un aviso y sigue funcionando.

**Guardados en `src/data/`:**

| Archivo | Contenido |
| --- | --- |
| `drivers.ts`, `teams.ts` | Pilotos y escuderías 2026 |
| `careers.json` | Trayectorias fuera de la F1 |
| `history-*.json` | Resultados de temporadas cerradas, hasta 2025 |
| `circuits.ts`, `tracks.json` | Calendario y trazados |
| `season.json` | Resultados y horarios de la temporada (generado) |
| `champions.json` | Campeones hasta 2025 |
| `tyres.ts` | Compuestos de neumáticos |
| `photo-credits.json` | Créditos de las fotos |

### Después de cada carrera

Corré `npm run datos` y volvé a compilar. Actualiza resultados, clasificación, sprints, horarios, gráfico y comparador. Al terminar la temporada también suma el año a los `history-*.json`.

### Qué actualizar a mano

- **Fichajes y reservas:** `drivers.ts`.
- **Cambios de calendario, récords o compuestos:** `circuits.ts`.
- **Campeones:** `champions.json` y la fila 2026 en `src/app/campeones/page.tsx`.

## Pendientes

- Logos de Red Bull y Racing Bulls: hoy se muestra el nombre.
- Karting de Luke Browning y Kush Maini.
- Verificar vueltas y distancia de Abu Dabi.
- Retrato de Leonardo Fornaroli.
- Al publicar: definir `metadataBase` para la imagen social.
- Los slugs inexistentes muestran "Esta página no existe", pero responden 200 en lugar de 404.

## Fuentes y licencias

- **Resultados:** Jolpica-F1, CC BY-NC-SA 4.0 (solo uso no comercial).
- **Trayectorias y datos de circuitos:** Wikipedia, CC BY-SA 4.0.
- **Fotos de los autos:** Liauzh en Wikimedia Commons, CC BY 4.0.
- **Fotos de los pilotos:** Wikimedia Commons; autor y licencia de cada una en `/creditos`.
- **Trazados:** [f1-circuits](https://github.com/bacinger/f1-circuits), MIT.
- **Neumáticos:** información de [Pirelli](https://www.pirelli.com/tires/en-us/motorsport/car/formula-1); los dibujos son propios.
- **Logos:** descargados de Wikimedia Commons; son marcas registradas de sus dueños.

Proyecto personal, sin relación con Formula 1, la FIA, Pirelli ni las escuderías.
