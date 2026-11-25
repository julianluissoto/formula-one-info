import { ImageResponse } from "next/og";

export const generateStaticParams = () => [{ size: "192" }, { size: "512" }];

export async function GET(_: Request, ctx: RouteContext<"/icono/[size]">) {
  const n = (await ctx.params).size === "512" ? 512 : 192;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#16181c" }}>
      <div style={{ width: "62%", height: "62%", display: "flex", borderRadius: 9999, border: `${n * 0.07}px solid #ffd23f` , alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40%", height: "40%", borderRadius: 9999, background: "#f1f2f4" }} />
      </div>
    </div>,
    { width: n, height: n },
  );
}
