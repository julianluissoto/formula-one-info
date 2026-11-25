import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "F1 Parrilla 2026",
    short_name: "F1 Parrilla",
    description: "Escuderías, pilotos, circuitos y resultados de la Fórmula 1 2026.",
    lang: "es-AR",
    start_url: "/",
    display: "standalone",
    background_color: "#16181c",
    theme_color: "#16181c",
    icons: [192, 512].map((n) => ({ src: `/icono/${n}`, sizes: `${n}x${n}`, type: "image/png" })),
  };
}
