import { ImageResponse } from "next/og";

export const generateStaticParams = () => [{ size: "192" }, { size: "512" }];

export async function GET(_: Request, ctx: RouteContext<"/icono/[size]">) {
  const n = (await ctx.params).size === "512" ? 512 : 192;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16181c" }}>
      <svg width={n * 0.75} height={n * 0.75} viewBox="0 0 100 100" fill="none" strokeLinecap="round">
        <path d="M50 88C34 70 64 62 50 42" stroke="#343942" strokeWidth="20" />
        <path d="M50 88C34 70 64 62 50 42" stroke="#f1f2f4" strokeWidth="11" />
        <circle cx="50" cy="15" r="10" fill="#ffd23f" />
      </svg>
    </div>,
    { width: n, height: n },
  );
}
