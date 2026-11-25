export type Tyre = { id: string; label: string; name: string; color: string; spec: string; tread: "slick" | "inter" | "wet" };

// Fuente: Pirelli (pirelli.com, gama P Zero 2026; nota de prensa del 09/12/2025).
export const tyres: Tyre[] = [
  { id: "C1", label: "C1", name: "El más duro", color: "#f1f2f4", tread: "slick", spec: "Para circuitos que más exigen. Soporta calor y carga, con tandas largas." },
  { id: "C2", label: "C2", name: "Duro", color: "#f1f2f4", tread: "slick", spec: "Muy durable. Para pistas rápidas, calurosas y abrasivas." },
  { id: "C3", label: "C3", name: "Versátil", color: "#f1f2f4", tread: "slick", spec: "Equilibra ritmo y duración. Puede ser duro, medio o blando." },
  { id: "C4", label: "C4", name: "Blando", color: "#f1f2f4", tread: "slick", spec: "Calienta rápido y agarra bien. Para pistas poco exigentes." },
  { id: "C5", label: "C5", name: "El más blando", color: "#f1f2f4", tread: "slick", spec: "Máximo agarre. Para pistas lentas, lisas y de poco desgaste." },
  { id: "INT", label: "I", name: "Intermedio", color: "#3ecf6b", tread: "inter", spec: "Pista mojada sin agua acumulada, o empezando a secarse." },
  { id: "WET", label: "W", name: "Lluvia extrema", color: "#4a9bff", tread: "wet", spec: "Lluvia fuerte. Evacúa mucha agua y reduce el aquaplaning." },
];

/** Orden en que cada GP lista sus tres compuestos de seco. */
export const roles = [
  { name: "Duro", color: "#f1f2f4" },
  { name: "Medio", color: "#ffd23f" },
  { name: "Blando", color: "#ff4b4b" },
];
