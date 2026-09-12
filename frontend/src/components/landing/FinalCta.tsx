"use client";

import Link from "next/link";
import { Reveal } from "./motion/Reveal";
import { useScrollScene, gsap } from "./motion/gsap";

export function FinalCta() {
  const scope = useScrollScene(() => {
    gsap.to("[data-cta-glow]", {
      scale: 1.14,
      opacity: 0.8,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <section id="demo" ref={scope} className="scroll-mt-24 relative overflow-hidden">
      <div
        data-cta-glow
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1000px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(33,53,221,0.34) 0%, rgba(8,9,12,0) 66%)",
        }}
      />

      <Reveal className="relative mx-auto flex max-w-[820px] flex-col items-center gap-6 px-5 py-20 text-center md:px-12 md:py-[130px]">
        <h2 className="m-0 text-[32px] font-semibold leading-[1.1] tracking-[-0.032em] text-white md:text-[54px]">
          Your regulars are already
          <br />
          <span className="text-[#9EC0FF]">walking through the door.</span>
        </h2>
        <p className="m-0 max-w-[560px] text-[15px] leading-[1.62] text-[#9BA1AF] md:text-[17.5px]">
          Start with one outlet today. Add the rest when you&rsquo;ve seen it work.
        </p>

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
          <a
            href="mailto:contact@zuplin.in?subject=Zuplin%20demo"
            className="flex h-[54px] w-full items-center justify-center rounded-xl bg-[#2135DD] px-9 text-base font-semibold text-white shadow-[0_0_40px_-8px_rgba(74,99,255,0.95)] transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Book a demo
          </a>
          <Link
            href="/signup"
            className="flex h-[54px] w-full items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.07] px-9 text-base font-semibold text-white transition-colors hover:bg-white/[0.12] sm:w-auto"
          >
            Start free
          </Link>
        </div>

        <p className="m-0 text-[12.5px] text-[#565C6B]">
          Free to start &middot; No card required &middot; Live the same day
        </p>
      </Reveal>
    </section>
  );
}
