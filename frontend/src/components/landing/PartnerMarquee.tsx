"use client";

import Image from "next/image";
import { useScrollScene, gsap } from "./motion/gsap";

/**
 * Partner strip.
 *
 * `logo` is intentionally empty for every entry: these are trademarked marks
 * and drawing them from memory gets them subtly wrong. Drop the real SVGs in
 * `public/partners/` and set `logo` — the chip swaps from the wordmark to the
 * image with no other change. Until then each chip shows the partner's name
 * as type, which reads as a deliberate wordmark rather than a broken image.
 */
type Partner = { name: string; logo?: string; verified?: boolean };

const PARTNERS: Partner[] = [
  { name: "Meta Business Partner", verified: true },
  { name: "WhatsApp Business API" },
  { name: "Petpooja" },
  { name: "Razorpay" },
  // A fifth partner was mentioned in the brief but the name could not be
  // identified, so it is left out rather than shipped as "Partner five".
  // Add it here once confirmed.
];

/**
 * How many copies of the set to lay down.
 *
 * The loop wraps by exactly one set width, so the track must stay at least
 * one set wider than the viewport or there is nothing to enter from the
 * right — that shows up as a blank stretch once a cycle. One set of these
 * five chips measures ~840px, so the track needs to clear
 * `viewport + 840`. Six copies gives ~5100px, which covers every realistic
 * display; simply duplicating the set once (the obvious approach) yields
 * ~1680px, narrower than an ordinary 1440px desktop viewport, which is
 * exactly the gap this replaced.
 */
const COPIES = 6;

function Chip({ partner }: { partner: Partner }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3">
      {partner.logo ? (
        <Image src={partner.logo} alt={partner.name} width={22} height={22} className="h-[22px] w-auto" />
      ) : (
        partner.verified && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <path
              d="M12 2.6l2.4 1.8 3-.3 1 2.8 2.5 1.7-1 2.9 1 2.9-2.5 1.7-1 2.8-3-.3L12 21.4l-2.4-1.8-3 .3-1-2.8L3.1 15.4l1-2.9-1-2.9 2.5-1.7 1-2.8 3 .3z"
              fill="#2135DD"
            />
            <path d="M8.8 12.2l2.2 2.2 4.2-4.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      )}
      <span className="whitespace-nowrap text-[13px] font-medium text-[#C9CDD6] md:text-sm">
        {partner.name}
      </span>
    </div>
  );
}

export function PartnerMarquee() {
  const scope = useScrollScene(({ scope: root }) => {
    const track = root.querySelector<HTMLElement>("[data-marquee-track]");
    const set = root.querySelector<HTMLElement>("[data-marquee-set]");
    const mask = root.querySelector<HTMLElement>("[data-marquee-mask]");
    if (!track || !set) return;

    const distance = set.offsetWidth + 18; // one set, plus the gap after it

    // Wrapping x through a modulo means the track never reaches an end to
    // fall off — it slides one set width and the modifier snaps it back, so
    // there is no seam and no empty stretch whatever the viewport width.
    const tween = gsap.to(track, {
      x: `-=${distance}`,
      duration: distance / 46, // constant speed rather than constant duration
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % distance),
      },
    });

    const pause = () => tween.pause();
    const play = () => tween.play();
    mask?.addEventListener("mouseenter", pause);
    mask?.addEventListener("mouseleave", play);
    return () => {
      mask?.removeEventListener("mouseenter", pause);
      mask?.removeEventListener("mouseleave", play);
    };
  });

  return (
    <div ref={scope} className="relative pb-16 md:pb-[86px]">
      <p className="mb-5 text-center text-[11.5px] font-medium uppercase tracking-[0.14em] text-[#565C6B] md:text-xs">
        Built on the rails your customers already use
      </p>

      <div
        data-marquee-mask
        className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_9%,#000_91%,transparent_100%)]"
      >
        <div data-marquee-track className="flex w-max items-center gap-[18px]">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div
              key={copy}
              // Only the first copy is measured; the rest are identical, so
              // one marker is enough and avoids ambiguity in the query above.
              {...(copy === 0 ? { "data-marquee-set": "" } : {})}
              className="flex shrink-0 items-center gap-[18px]"
              aria-hidden={copy > 0}
            >
              {PARTNERS.map((p) => (
                <Chip key={p.name} partner={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
