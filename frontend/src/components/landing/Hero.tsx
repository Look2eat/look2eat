"use client";

import { motion } from "framer-motion";
import { useScrollScene, gsap } from "./motion/gsap";
import { ease } from "./tokens";

/**
 * The coin glyph that sits inline in the payoff line. It carries the only
 * glow in the headline, so it reads as the thing the sentence turns on.
 */
function CoinGlyph() {
  return (
    <span
      data-hero-glyph
      className="mx-1 inline-flex h-[0.82em] w-[0.82em] translate-y-[0.06em] items-center justify-center rounded-full bg-gradient-to-br from-[#9EC0FF] to-[#2135DD] align-middle shadow-[0_0_34px_-2px_rgba(74,99,255,0.9)]"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" className="h-[52%] w-[52%]">
        <path d="M12 6.5v11M8.6 9.6h6.8M8.6 14.4h6.8" />
      </svg>
    </span>
  );
}

export function Hero() {
  const scope = useScrollScene(() => {
    // The hero sinks and dims a little as the white sheet below rises over
    // it, so the two sections feel like stacked planes rather than a cut.
    // The hero is pinned by a sticky wrapper while the sheet below climbs
    // over it, so this only has to dim and settle it — not move it out of
    // the way. Scale sinks it slightly so the sheet reads as the nearer plane.
    gsap.to("[data-hero-inner]", {
      scale: 0.94,
      opacity: 0.28,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-hero]",
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    });

    gsap.to("[data-hero-glow]", {
      scale: 1.12,
      opacity: 0.75,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to("[data-hero-glyph]", {
      boxShadow: "0 0 52px 2px rgba(74,99,255,1)",
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <div ref={scope} data-hero className="relative overflow-hidden">
      <div
        data-hero-glow
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[700px] w-[1100px] -translate-x-1/2 opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(33,53,221,0.30) 0%, rgba(33,53,221,0.10) 38%, rgba(8,9,12,0) 68%)",
        }}
      />

      <div
        data-hero-inner
        className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-7 px-5 pb-24 pt-[120px] text-center md:px-12 md:pb-[150px] md:pt-[172px]"
      >
        <h1 className="m-0 text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[54px] md:text-[68px] lg:text-[78px]">
          <motion.span
            className="block text-[#565C6B]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out }}
          >
            A diner walks in,
          </motion.span>
          <motion.span
            className="block text-[#565C6B]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: ease.out }}
          >
            pays, and disappears.
          </motion.span>
          <motion.span
            className="block text-white"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: ease.out }}
          >
            Unless
            <CoinGlyph />
            you keep them
          </motion.span>
        </h1>

        <motion.p
          className="m-0 max-w-[620px] text-[15px] leading-[1.65] text-[#9BA1AF] md:text-[17px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: ease.out }}
        >
          Zuplin runs your restaurant&rsquo;s loyalty programme, collects real feedback and
          pushes your happiest tables to Google &mdash; all over WhatsApp. Nothing for your
          customers to install.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.54, ease: ease.out }}
        >
          <a
            href="#demo"
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#2135DD] px-8 text-[15.5px] font-semibold text-white shadow-[0_0_34px_-6px_rgba(74,99,255,0.9)] transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Book a demo
          </a>
          <a
            href="#pricing"
            className="flex h-[52px] w-full items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.07] px-8 text-[15.5px] font-semibold text-white transition-colors hover:bg-white/[0.12] sm:w-auto"
          >
            Start free
          </a>
        </motion.div>

        <motion.p
          className="m-0 text-[12.5px] text-[#565C6B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.68 }}
        >
          Free to start &middot; No card required &middot; Works with your current billing
        </motion.p>
      </div>
    </div>
  );
}
