import { ImageResponse } from "next/og";

// Square favicon generated at build/request time so browser tabs and the iOS
// home-screen icon get a proper square mark instead of the wide logo banner.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#cb1e27",
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: -2,
          borderRadius: 12,
        }}
      >
        GG
      </div>
    ),
    { ...size }
  );
}
