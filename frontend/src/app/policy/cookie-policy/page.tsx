import type { Metadata } from "next";
import { Footer } from "@/components/blocks/footer-section";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Zuplin uses cookies and similar technologies, what each type is for, and how you can control them.",
  alternates: { canonical: "/policy/cookie-policy" },
};

/**
 * Written to match the structure and tone of the sibling policy pages.
 *
 * PLACEHOLDERS to replace before launch are marked inline with [square
 * brackets]. Nothing here asserts a specific analytics or advertising vendor,
 * because none has been confirmed — if Zuplin does not run analytics or
 * marketing cookies, delete those two sections rather than leaving them in.
 */
export default function CookiePolicyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-4xl font-bold">Cookie Policy</h1>
        <p className="mb-6 text-muted-foreground">
          Last updated: [DATE]. This policy explains how Zuplin uses cookies and similar
          technologies on our website and in our dashboard.
        </p>

        <div className="space-y-6 [&_strong]:font-semibold [&_strong]:text-foreground">
          <div className="space-y-2">
            <p>
              <strong>What cookies are</strong>
            </p>
            <p>
              Cookies are small text files a website stores on your device. They let a site
              remember things between page loads &mdash; that you are signed in, for example
              &mdash; and let us understand how the site is used. Similar technologies such as
              local storage and session storage work the same way and are covered by this policy.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Strictly necessary cookies</strong>
            </p>
            <p>
              These are required for the service to work and cannot be switched off. Zuplin uses
              them to keep you signed in to your dashboard or cashier panel and to protect against
              request forgery. Our session cookies are set as HTTP-only, which means they cannot be
              read by scripts in your browser. If you block these cookies, you will not be able to
              sign in.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Preference cookies</strong>
            </p>
            <p>
              These remember choices you make so the interface behaves the way you left it &mdash;
              for example your light or dark theme preference. They are not used to identify you.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Analytics cookies</strong>
            </p>
            <p>
              We may use analytics to understand which pages are visited and where people run into
              difficulty, so we can improve the product. This is measured in aggregate. [CONFIRM
              WHETHER ANALYTICS IS IN USE, AND NAME THE PROVIDER &mdash; e.g. Google Analytics,
              Plausible, Vercel Analytics. If no analytics is used, remove this section.]
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Marketing cookies</strong>
            </p>
            <p>
              [CONFIRM WHETHER ANY ADVERTISING OR RETARGETING TECHNOLOGY IS IN USE. If none is,
              remove this section rather than leaving it in &mdash; stating that you set marketing
              cookies when you do not is itself misleading.]
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Cookies set by others</strong>
            </p>
            <p>
              Some pages rely on third-party services that may set their own cookies, such as our
              payment provider during checkout. Those cookies are governed by that provider&rsquo;s
              own policy.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>How to control cookies</strong>
            </p>
            <p>
              Every major browser lets you see the cookies a site has set, delete them, and block
              future ones &mdash; look under Privacy or Site settings. You can also browse in a
              private window, which clears cookies when you close it. Blocking strictly necessary
              cookies will stop you signing in; blocking the others will not prevent you using the
              site.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Changes to this policy</strong>
            </p>
            <p>
              We may update this policy as the product changes. When we do, we will revise the date
              at the top of this page.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Contact</strong>
            </p>
            <p>
              Questions about this policy can go to{" "}
              <a className="underline" href="mailto:contact@zuplin.in">
                contact@zuplin.in
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
