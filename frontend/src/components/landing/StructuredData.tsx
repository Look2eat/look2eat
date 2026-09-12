import { site, siteUrl } from "@/lib/site";

/**
 * JSON-LD for the landing page.
 *
 * Scoped deliberately to what the page actually states. No `aggregateRating`
 * (there are no published reviews), no `offers` with a price (pricing is not
 * public yet), and no `award`/`foundingDate`/`address` — inventing any of
 * those is both a lie and, for rich results, a policy violation.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description: site.tagline,
        email: site.email,
        telephone: site.phoneHref,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: site.email,
          telephone: site.phoneHref,
          availableLanguage: ["en", "hi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-IN",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: site.name,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Customer loyalty and engagement",
        operatingSystem: "Web browser",
        url: siteUrl,
        description: site.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        featureList: [
          "Loyalty programme with a branded reward card",
          "Automated WhatsApp campaigns",
          "Customer segmentation from billing data",
          "Feedback collection and Google review routing",
          "Item-level feedback reporting",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The object is built here from typed constants, not from user input,
      // so there is nothing to escape.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * FAQPage markup, generated from the same array the FAQ section renders, so
 * the two can never disagree — which is what Google checks for.
 */
export function FaqStructuredData({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
