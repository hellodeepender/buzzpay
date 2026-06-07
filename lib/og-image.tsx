import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#f4e9d4", color: "#1c1813", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: "#ffb300", border: "4px solid #1c1813", borderRadius: "18px", fontSize: "42px", fontWeight: 700 }}>b</div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700 }}>buzzpay</div>
        </div>
        <div style={{ display: "flex", fontSize: "66px", fontWeight: 800, lineHeight: 1.05, maxWidth: "920px" }}>{title}</div>
        <div style={{ display: "flex", width: "200px", height: "14px", background: "#ffb300", marginTop: "24px", marginBottom: "26px" }} />
        <div style={{ display: "flex", fontSize: "32px", color: "#4a4036", maxWidth: "880px" }}>{subtitle}</div>
        <div style={{ display: "flex", fontSize: "26px", color: "#857a6c", marginTop: "28px" }}>buzzpay.app</div>
      </div>
    ),
    ogSize
  );
}
