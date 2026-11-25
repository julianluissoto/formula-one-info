import { ImageResponse } from "next/og";

export const alt = "F1 Parrilla 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = ["#27d8c4", "#f0323f", "#5b86de", "#ff8a1f", "#8ea6ff", "#1fa6ea", "#c9ced6", "#f0603c", "#3f86ff", "#2ba678", "#e0c27a"];

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#16181c", color: "#f1f2f4" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 110 }}>F1 Parrilla 2026</div>
        <div style={{ fontSize: 40, color: "#a3aab6", marginTop: 20 }}>Escuderías, pilotos, circuitos y resultados</div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>{colors.map((c) => <div key={c} style={{ width: 80, height: 120, borderTop: `10px solid ${c}`, background: "#202329" }} />)}</div>
    </div>,
    size,
  );
}
