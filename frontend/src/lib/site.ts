/**
 * Canonical site configuration.
 *
 * `NEXT_PUBLIC_SITE_URL` should be set in the deployment environment. The
 * fallback is the production domain so canonical URLs, the sitemap and
 * Open Graph tags are still correct on a build without it — but set it,
 * otherwise preview deployments will claim to be production.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zuplin.in"
).replace(/\/$/, "");

export const site = {
  name: "Zuplin",
  /** Used as the OG/Twitter title and the home page's own title. */
  title: "Zuplin — Loyalty, feedback and WhatsApp campaigns for restaurants",
  tagline: "Customer engagement and loyalty built for the F&B industry",
  description:
    "Zuplin runs your restaurant's loyalty programme, collects real feedback and pushes your happiest tables to Google — all over WhatsApp. Nothing for your customers to install.",
  /** Sales and demo enquiries (the address used in the brochure). */
  email: "contact@zuplin.in",
  /** Existing support address, already shipped in the app footer. */
  supportEmail: "support@zuplin.in",
  phone: "+91 98880 32525",
  /** E.164, for tel: links and structured data. */
  phoneHref: "+919888032525",
  locale: "en_IN",
} as const;

/**
 * Every indexable route, for the sitemap. Keep in step with src/app.
 * /login is deliberately absent — it is marked noindex.
 */
export const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/signup", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/policy/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/policy/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/policy/cookie-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/policy/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/policy/data-protection-policy", priority: 0.3, changeFrequency: "yearly" as const },
];
