import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in surfaces and the BFF proxy have nothing to index, and the
        // customer wallet pages are per-person links, not public content.
        disallow: ["/api/", "/dashboard/", "/cashier/", "/loyalty/", "/widget-01"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
