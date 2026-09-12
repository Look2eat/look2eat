import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, generated at build time rather than shipped as a static
 * asset — so it can never drift out of step with the page's own wording.
 * Deliberately uses no webfont: loading one here costs a network fetch per
 * render and the system stack is legible at this size.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090C",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            left: 240,
            width: 900,
            height: 640,
            background:
              "radial-gradient(ellipse at center, rgba(33,53,221,0.55) 0%, rgba(8,9,12,0) 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #9EC0FF 0%, #2135DD 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 70,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: "#565C6B" }}>A diner walks in,</span>
            <span style={{ color: "#565C6B" }}>pays, and disappears.</span>
            <span style={{ color: "#ffffff" }}>Unless you keep them.</span>
          </div>
          {/* Satori requires an explicit `display` on any element with more
              than one child node, and it counts each text run and expression
              separately — so this stays a single interpolated string. */}
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#9BA1AF",
              maxWidth: 940,
              lineHeight: 1.4,
            }}
          >
            {`${site.tagline}. Loyalty, feedback and WhatsApp campaigns — nothing for your customers to install.`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
