/**
 * Real-world content the landing page needs but nobody has supplied yet.
 *
 * Everything here is deliberately typed as nullable and defaults to `null`.
 * The sections that depend on it render nothing while it is null, rather than
 * shipping bracketed placeholders like "[X]%" to visitors. Fill a value in
 * and its section appears — no component changes needed.
 *
 * Nothing in this file may be invented. These are claims about a real
 * business and a real customer.
 */

export type Stat = {
  /** e.g. "38%" — include the unit or symbol. */
  value: string;
  label: string;
};

export type Testimonial = {
  company: string;
  /** The customer's own words. Never write this on their behalf. */
  quote: string;
  personName: string;
  personRole: string;
  /** Optional: path under /public, e.g. "/partners/anies.svg". */
  logoSrc?: string;
  /** Optional: path under /public. */
  photoSrc?: string;
  /** Up to three verified outcomes. */
  results?: Stat[];
};

/* ─────────────────────────────────────────────────────────────────────────
   VERIFIED CONTENT — fill these in and they ship.
   ───────────────────────────────────────────────────────────────────────── */

/** Headline numbers for the band under the feature stack. */
const verifiedStats: Stat[] | null = null;

/**
 * Anie's Coffee & Co. Needs their actual quote, the person's name and role,
 * and any results they are happy to have published.
 */
const verifiedTestimonial: Testimonial | null = null;

/* ─────────────────────────────────────────────────────────────────────────
   PREVIEW FALLBACK

   So the two sections can still be reviewed while the real content is being
   gathered.

   They show automatically in development. On a deployed build they are hidden
   by default — a visitor should never read "[REAL QUOTE FROM ANIE'S]" — but
   you can switch them on for a staging or review deployment by setting:

       NEXT_PUBLIC_SHOW_UNVERIFIED_CONTENT=true

   Leave that unset on the real production site. Delete this whole block once
   the verified content above is filled in.
   ───────────────────────────────────────────────────────────────────────── */

const PREVIEW_UNVERIFIED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_CONTENT === "true";

const previewStats: Stat[] = [
  { value: "[X]%", label: "of diners on Zuplin come back within [X] days" },
  { value: "[X]×", label: "more Google reviews in the first [X] months" },
  { value: "[X] min", label: "to get your first outlet live, start to finish" },
];

const previewTestimonial: Testimonial = {
  company: "Anie's Coffee & Co",
  quote:
    "[REAL QUOTE FROM ANIE'S — what changed after Zuplin, in their own words. The strongest version names a number: repeat visits, Google rating, or how many regulars came back.]",
  personName: "[NAME]",
  personRole: "[ROLE]",
  results: [
    { value: "[X]%", label: "more repeat visits since going live" },
    { value: "[X.X]★", label: "Google rating, up from [X.X]" },
    { value: "[X]", label: "regulars enrolled in the first month" },
  ],
};

export const stats: Stat[] | null =
  verifiedStats ?? (PREVIEW_UNVERIFIED ? previewStats : null);

export const testimonial: Testimonial | null =
  verifiedTestimonial ?? (PREVIEW_UNVERIFIED ? previewTestimonial : null);

/**
 * Plan pricing. A null `price` renders the plan as "Talk to us" with an
 * enquiry CTA instead of a made-up number, so the table is still usable.
 * TODO: set the real monthly or annual figures.
 */
export type Plan = {
  name: string;
  blurb: string;
  price: string | null;
  period: string | null;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    blurb: "One outlet finding its regulars",
    price: null,
    period: null,
    features: [
      "1 outlet, unlimited cashiers",
      "Coins, milestones and a branded reward card",
      "Feedback collection and Google review routing",
      "Dashboard and full reward history",
    ],
  },
  {
    name: "Growth",
    blurb: "A few outlets, one programme",
    price: null,
    period: null,
    featured: true,
    features: [
      "Everything in Starter, across multiple outlets",
      "Outlet-wise sales and feedback reporting",
      "WhatsApp campaigns to your customer list",
      "Instant manager alerts on poor reviews",
    ],
  },
  {
    name: "Chain",
    blurb: "Many outlets, many cities",
    price: null,
    period: null,
    features: [
      "Unlimited outlets",
      "A dedicated account manager",
      "Custom rollout and staff training",
      "Priority support on WhatsApp",
    ],
  },
];
