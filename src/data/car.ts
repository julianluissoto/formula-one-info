// Fuentes: reglamento técnico FIA 2026, Sección C, edición 20 (05/08/2026); Formula1.com; Wikipedia (Mercedes W17, temporada 2026).
export type PartId = "combustion" | "turbo" | "mguk" | "bateria" | "caja" | "aleron-delantero" | "aleron-trasero" | "chasis" | "piso" | "ruedas" | "suspension";

export type Part = { id: PartId; name: string; inside?: boolean; text: string; specs: [string, string][] };

export const parts: Part[] = [
  { id: "combustion", name: "Motor de combustión", inside: true, text: "Quema combustible sostenible avanzado y mueve las ruedas traseras. Aporta cerca de la mitad de la potencia total.",
    specs: [["Tipo", "V6 a 90°, turbo"], ["Cilindrada", "1.600 cm³"], ["Diámetro de cilindro", "80 mm"], ["Potencia aproximada", "400 kW (540 hp)"], ["Compresión máxima", "16:1"], ["Presión de inyección máxima", "350 bar"], ["Flujo de energía máximo", "3.000 MJ/h"], ["Masa mínima de la unidad de potencia", "185 kg"]] },
  { id: "turbo", name: "Turbo", inside: true, text: "Un solo turbo comprime el aire de admisión con la energía del escape. Desde 2026 ya no existe el MGU-H, que recuperaba electricidad de ese calor.",
    specs: [["Cantidad", "1, de una sola etapa"], ["Giro máximo", "150.000 rpm"], ["MGU-H", "Eliminado en 2026"]] },
  { id: "mguk", name: "Motor eléctrico (MGU-K)", inside: true, text: "Recupera energía al frenar y la devuelve al acelerar. Su potencia casi se triplicó frente a los 120 kW de 2025.",
    specs: [["Potencia máxima", "350 kW (470 hp)"], ["Giro máximo", "60.000 rpm"], ["Par máximo", "500 Nm, referido al cigüeñal"], ["Sin asistencia eléctrica", "Desde 345 km/h; 355 con modo adelantamiento"]] },
  { id: "bateria", name: "Batería", inside: true, text: "Almacena la electricidad que usa el MGU-K. Va protegida detrás y debajo del piloto.",
    specs: [["Variación máxima de carga", "4 MJ"], ["Recarga máxima por vuelta", "8,5 MJ; menos en algunos circuitos"], ["Extra con modo adelantamiento", "Hasta 0,5 MJ"], ["Masa mínima del conjunto principal", "35 kg"]] },
  { id: "caja", name: "Caja de cambios", inside: true, text: "Semiautomática y secuencial, se acciona desde el volante.",
    specs: [["Marchas", "8 y reversa"], ["Tracción", "Trasera"]] },
  { id: "aleron-delantero", name: "Alerón delantero", text: "Sus flaps se mueven. Cerrados dan carga para doblar; abiertos bajan la resistencia en la recta. Probá el botón «Modo recta».",
    specs: [["Aerodinámica activa", "Sí"], ["Modos", "Curva y recta"]] },
  { id: "aleron-trasero", name: "Alerón trasero", text: "Se abre en las rectas habilitadas sin necesidad de ir cerca de otro auto. Reemplaza al DRS y pierde el alerón inferior.",
    specs: [["Aerodinámica activa", "Sí"], ["Alerón inferior", "Eliminado"]] },
  { id: "chasis", name: "Chasis y halo", text: "La celda de supervivencia de fibra de carbono protege al piloto. El arco de seguridad soporta más carga que en 2025.",
    specs: [["Material", "Compuesto de fibra de carbono"], ["Resistencia del arco", "20 g (antes 16 g)"], ["Ensayo de carga del arco", "167 kN (antes 141 kN)"]] },
  { id: "piso", name: "Piso y difusor", text: "Más plano que en 2022-2025, con un difusor más grande. Depende menos del efecto suelo.",
    specs: [["Efecto suelo", "Reducido"], ["Difusor", "Más largo y con mayor apertura"]] },
  { id: "ruedas", name: "Ruedas y frenos", text: "Neumáticos Pirelli más angostos, sobre llantas de magnesio de 18 pulgadas.",
    specs: [["Ancho delantero", "280 mm"], ["Ancho trasero", "375 mm"], ["Material de la llanta", "Aleación de magnesio"], ["Frenos", "Un disco por rueda, hasta 34 mm de espesor"]] },
  { id: "suspension", name: "Suspensión", text: "Triángulos de fibra de carbono. Mercedes y Ferrari usan varilla de empuje en los dos ejes.",
    specs: [["Tipo en el W17 y el SF-26", "Varilla de empuje (push-rod)"], ["Material en el W17", "Fibra de carbono"]] },
];

export const dimensions: [string, string, string][] = [
  ["Distancia entre ejes", "3.400 mm", "Máximo del reglamento; antes 3.600"],
  ["Ancho", "1.900 mm", "Máximo del reglamento; antes 2.000"],
  ["Largo", "5.505 mm", "Mercedes W17"],
  ["Alto", "950 mm", "Mercedes W17"],
  ["Peso mínimo", "768 kg", "Cifra anunciada por la F1; el reglamento fija 724 kg más los neumáticos"],
  ["Potencia total", "Más de 1.000 hp", "Combustión y eléctrica"],
];
