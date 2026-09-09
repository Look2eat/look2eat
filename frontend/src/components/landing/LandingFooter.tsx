"use client";

import Link from "next/link";
import { ZuplinMark } from "./ZuplinMark";
import { site } from "@/lib/site";

/**
 * Every link here points at a route or address that actually exists — the
 * policy pages under /policy, the real auth routes, and the contact details
 * used everywhere else on the page. No placeholder hrefs, and no social
 * profiles: none have been provided, and inventing them sends people to
 * accounts that may belong to someone else.
 */
const COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Book a demo", href: "/#demo" },
      { label: site.email, href: `mailto:${site.email}`, external: true },
      { label: site.phone, href: `tel:${site.phoneHref}`, external: true },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Start free", href: "/signup" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/policy/privacy-policy" },
      { label: "Terms & Conditions", href: "/policy/terms-and-conditions" },
      { label: "Cookie Policy", href: "/policy/cookie-policy" },
      { label: "Refund Policy", href: "/policy/refund-policy" },
      { label: "Data Protection", href: "/policy/data-protection-policy" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer
      data-landing-dark
      className="border-t border-white/[0.07] bg-[#08090C] font-poppins text-white"
    >
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] md:gap-10 md:px-12 md:py-16">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label={`${site.name} home`}
          >
            <ZuplinMark size={30} />
            <span className="text-lg font-semibold tracking-[-0.01em] text-white">
              {site.name}
            </span>
          </Link>
          <p className="m-0 max-w-[290px] text-[14px] leading-[1.6] text-[#6B7180]">
            {site.tagline}. Runs on WhatsApp, alongside the billing system you
            already use.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className="flex flex-col gap-3.5"
          >
            {/* Not a heading: each <nav> already carries aria-label={col.title},
                so an h2 here only added noise to the document outline and sat
                at the same level as the page's real section headings. */}
            <p className="m-0 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[#565C6B]">
              {col.title}
            </p>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      className="-mx-1 inline-block rounded px-1 py-1.5 text-[14px] text-[#9BA1AF] transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="-mx-1 inline-block rounded px-1 py-1.5 text-[14px] text-[#9BA1AF] transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-6 text-[12.5px] text-[#565C6B] sm:flex-row sm:items-center sm:justify-between md:px-12">
          <p className="m-0">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="m-0">Made for restaurants in India.</p>
        </div>
      </div>
    </footer>
  );
}
