import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Dr Arun Chandan, Ayurveda, medicinal plants and livelihoods";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#071a14",
          color: "#f4f1ea",
          display: "flex",
          alignItems: "center",
          padding: 72,
          gap: 56,
        }}
      >
        <img src={src} width={360} height={360} alt="" />
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05 }}>Ayurveda, medicinal plants and livelihoods</div>
      </div>
    ),
    size,
  );
}
