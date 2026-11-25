import { ImageResponse } from "next/og";

export const alt = "F1 Info 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = ["#27d8c4", "#f0323f", "#5b86de", "#ff8a1f", "#8ea6ff", "#1fa6ea", "#c9ced6", "#f0603c", "#3f86ff", "#2ba678", "#e0c27a"];

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#15151e", color: "#f1f2f4" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 110 }}>
          <svg width="90" height="158" viewBox="22 2 56 98" fill="none" strokeLinecap="round">
            <path d="M50 88C34 70 64 62 50 42" stroke="#3a3a48" strokeWidth="20" />
            <path d="M50 88C34 70 64 62 50 42" stroke="#f1f2f4" strokeWidth="11" />
            <circle cx="50" cy="15" r="10" fill="#e10600" />
          </svg>
          F1 Info 2026</div>
        <div style={{ fontSize: 40, color: "#a3aab6", marginTop: 20 }}>Escuderías, pilotos, circuitos y resultados</div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>{colors.map((c) => <div key={c} style={{ width: 80, height: 120, borderTop: `10px solid ${c}`, background: "#20202b" }} />)}</div>
    </div>,
    size,
  );
}
