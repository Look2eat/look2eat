"use client";

import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { useScrollScene, gsap } from "./motion/gsap";

function WhatsAppGlyph({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" />
    </svg>
  );
}

export function ReviewRouter() {
  const scope = useScrollScene(() => {
    // The glow drifts as the section passes, so the dark band doesn't read
    // as a flat rectangle between two busy sections.
    gsap.fromTo(
      "[data-router-glow]",
      { yPercent: 12, opacity: 0.6 },
      {
        yPercent: -12,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-router]",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  return (
    <div ref={scope} data-router className="relative overflow-hidden">
      <div
        data-router-glow
        className="pointer-events-none absolute -bottom-60 -left-40 h-[620px] w-[800px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(33,53,221,0.24) 0%, rgba(8,9,12,0) 66%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-[72px] md:px-12 md:py-[110px]">
        <Reveal className="flex flex-col items-start gap-5">
          <span className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-[#6f86ff]">
            Feedback that protects your rating
          </span>
          <h2 className="m-0 text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] md:text-[48px]">
            <span className="text-[#565C6B]">Happy diners go to Google.</span>
            <br />
            <span className="text-white">Unhappy ones come to you.</span>
          </h2>
          <p className="m-0 max-w-[500px] text-[15.5px] leading-[1.62] text-[#9BA1AF] md:text-[17.5px]">
            Every customer is asked how the meal went. Four and five stars get a one-tap path
            to your listing &mdash; and coins for the trouble. Anything lower never reaches
            Google: it lands in your dashboard with the reason attached, and pings your outlet
            manager while the table is still warm.
          </p>
          <a
            href="#features"
            className="mt-1 flex h-[52px] items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.07] px-7 text-[15.5px] font-semibold text-white transition-colors hover:bg-white/[0.12]"
          >
            See how feedback works
          </a>
        </Reveal>

        <RevealGroup className="relative flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <RevealItem>
              <div className="flex h-full flex-col gap-3 rounded-[22px] border border-[#22c55e]/20 bg-[#0F1A14] px-6 py-[26px]">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#4ade80]">
                  4&ndash;5 stars
                </span>
                <span className="text-[17.5px] font-semibold leading-[1.32] text-white">
                  Sent to your Google listing
                </span>
                <span className="text-sm leading-[1.55] text-[#9BA1AF]">
                  One tap, review posted, coins credited automatically.
                </span>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="flex h-full flex-col gap-3 rounded-[22px] border border-[#ef4444]/20 bg-[#1A0F12] px-6 py-[26px]">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#f87171]">
                  1&ndash;3 stars
                </span>
                <span className="text-[17.5px] font-semibold leading-[1.32] text-white">
                  Kept private, sent to you
                </span>
                <span className="text-sm leading-[1.55] text-[#9BA1AF]">
                  Reason logged, manager alerted instantly.
                </span>
              </div>
            </RevealItem>
          </div>

          <RevealItem>
            <div className="flex items-center gap-3.5 rounded-[20px] border border-white/[0.08] bg-[#12141A] px-[22px] py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]">
                <WhatsAppGlyph />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13.5px] font-semibold text-white">
                  Manager alert &middot; Indiranagar
                </span>
                <span className="text-[12.5px] text-[#9BA1AF]">
                  2&#9733; &mdash; &ldquo;Service was slow.&rdquo; Table 14, 8:42 pm.
                </span>
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-[#12141A] px-[22px] py-5">
              <div className="flex items-center gap-3">
                <span className="text-[17px] text-[#f0b429]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span className="text-[13.5px] text-[#C9CDD6]">New review on Google</span>
              </div>
              <span className="rounded-full bg-[#6e86ff]/15 px-3 py-1.5 text-xs font-semibold text-[#6f86ff]">
                +35 coins
              </span>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </div>
  );
}
