import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { PartnerMarquee } from "@/components/landing/PartnerMarquee";
import { AudienceSplit } from "@/components/landing/AudienceSplit";
import { CounterStepper } from "@/components/landing/CounterStepper";
import { ReviewRouter } from "@/components/landing/ReviewRouter";
import { WinBack } from "@/components/landing/WinBack";
import { FeatureStack } from "@/components/landing/FeatureStack";
import { StatsBand } from "@/components/landing/StatsBand";
import { Testimonial } from "@/components/landing/Testimonial";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SectionTransition } from "@/components/landing/SectionTransition";
import { StructuredData } from "@/components/landing/StructuredData";

export const metadata: Metadata = {
  // The root layout already sets the default title, description, OG and
  // Twitter tags; this only pins the canonical for the home route.
  alternates: { canonical: "/" },
};

/**
 * The landing page, built from the approved design canvas
 * (design/Main.dc.html + design/Mobile.dc.html).
 *
 * The page alternates dark bands and light "sheets": the sheets have rounded
 * top corners and sit over the band above them, which is what gives the
 * scroll its sense of stacked planes. Each band is its own component under
 * components/landing/ — this file only decides the order and the grounds.
 *
 * Deliberately not wrapped in ThemeProvider's dark/light classes: a marketing
 * page has one look, whatever theme the visitor's OS reports.
 */
export default function Home() {
  return (
    <>
      <StructuredData />

      {/* Keyboard and screen-reader users can jump the nav. Visually hidden
          until focused, then it sits over the hero. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#1D2033]"
      >
        Skip to content
      </a>

      <LandingNav />

      <main
        id="main"
        data-landing
        className="min-h-screen bg-[#08090C] font-poppins text-white"
      >
        {/* ── Band 1 + Sheet 1, as one overlapping pair ──
          The hero is sticky inside this wrapper, so it holds its place while
          the white sheet rises over it and covers it. The wrapper ends where
          the sheet does, which is what releases the hero — sticking it to
          `main` instead would keep it composited for the whole page. */}
        <div className="relative">
          <div className="sticky top-0 z-0">
            <Hero />
            <PartnerMarquee />
          </div>

          {/* ── Sheet 1 · light: who it's for, and how it runs ── */}
          <div className="relative z-10 rounded-t-[32px] bg-white text-[#1D2033] shadow-[0_-30px_70px_-20px_rgba(0,0,0,0.75)] md:rounded-t-[40px]">
            <AudienceSplit />
            <SectionTransition tone="light" />
            <CounterStepper />
            <div className="h-10 md:h-16" />
          </div>
        </div>

        {/* ── Band 2 · dark: feedback, recovery, the four pillars ── */}
        <ReviewRouter />
        <SectionTransition />
        <WinBack />
        <SectionTransition />
        <FeatureStack />
        <SectionTransition size="sm" />
        <StatsBand />

        {/* ── Dark band: the customer's own words, on a white card ── */}
        <Testimonial  />
        <SectionTransition size="sm" />

        {/* ── Sheet 2 · light: what it costs, what you're wondering ── */}
        <div className="bg-white text-[#1D2033]">
          <Pricing />
          <SectionTransition tone="light" />
          <Faq />
        </div>

        {/* ── Band 3 · dark: the ask ── */}
        <SectionTransition size="sm" />
        <FinalCta />
      </main>

      <LandingFooter />
    </>
  );
}
