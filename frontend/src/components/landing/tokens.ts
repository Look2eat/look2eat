/**
 * Landing-page design tokens, lifted from the approved design canvas
 * (design/Main.dc.html). The landing page is dark-first and deliberately
 * independent of the dashboard's theme tokens — it must look identical
 * whatever theme the visitor's OS reports, so these are literal values
 * rather than CSS custom properties.
 */

export const ink = {
  /** page ground */
  base: "#08090C",
  /** raised card */
  panel: "#0F1116",
  /** panel one step lighter, for nested wells */
  panelSoft: "#12141A",
  /** deepest well, used inside light sheets */
  well: "#0D0F14",
} as const;

export const brand = {
  primary: "#2135DD",
  primaryMid: "#4a63ff",
  primaryLight: "#9EC0FF",
  /** body-copy-safe tint of primary on dark */
  primaryInk: "#6f86ff",
} as const;

export const onDark = {
  title: "#ffffff",
  body: "#C9CDD6",
  muted: "#9BA1AF",
  subtle: "#6B7180",
  faint: "#565C6B",
} as const;

export const onLight = {
  title: "#1D2033",
  body: "#4A4F5E",
  muted: "#6B7180",
  subtle: "#8D9098",
  /** the light sheet's own ground */
  sheet: "#ffffff",
  well: "#f2f6fa",
} as const;

/** WhatsApp surfaces — used for the message mockups, not as brand colour. */
export const whatsapp = {
  brand: "#25D366",
  header: "#075E54",
  paper: "#ECE5DD",
} as const;

/**
 * One accent per feature pillar, matching the brochure's colour coding.
 * Kept restrained: the accent appears in the eyebrow, the chips and a
 * hairline — never as a full-card wash, which is what made the earlier
 * grid read as generated filler.
 */
export const pillarAccents = {
  loyalty: "#f0b429",
  crm: "#a78bfa",
  campaigns: "#fb923c",
  reviews: "#f472b6",
} as const;

/** Anie's Coffee & Co brand pink, for the testimonial only. */
export const anies = "#F2187A";

/** Shared easing so framer-motion and GSAP move the same way. */
export const ease = {
  /** framer-motion cubic-bezier array */
  out: [0.22, 1, 0.36, 1] as const,
  /** the GSAP string equivalent */
  gsapOut: "power3.out",
} as const;
