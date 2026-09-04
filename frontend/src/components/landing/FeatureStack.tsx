"use client";

import type { ComponentType } from "react";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { pillarAccents } from "./tokens";
import {
  LoyaltyVisual,
  CrmVisual,
  CampaignVisual,
  ReviewsVisual,
} from "./visuals/PillarVisuals";

type Pillar = {
  n: string;
  eyebrow: string;
  accent: string;
  title: string;
  body: string;
  chips: string[];
  Visual: ComponentType;
};

/** The four pillars from the Zuplin brochure, in the brochure's own order. */
const PILLARS: Pillar[] = [
  {
    n: "01",
    eyebrow: "Loyalty Programme",
    accent: pillarAccents.loyalty,
    title: "A rewards programme that looks like yours, not ours",
    body: "Set what ₹1 earns, name your own currency, build the reward ladder — then let it run. Points expire on your rules, and the reminder goes out on its own.",
    chips: ["Tier rewards", "Smart expiry alerts", "Auto-enrol on first bill"],
    Visual: LoyaltyVisual,
  },
  {
    n: "02",
    eyebrow: "Customer CRM",
    accent: pillarAccents.crm,
    title: "Your regulars, your lapsers, and everyone in between",
    body: "Every bill builds the profile: how often they come, what they spend, what they order. The segments build themselves, and each one is an audience you can message.",
    chips: ["Auto segments", "Visit & spend history", "Outlet-level view"],
    Visual: CrmVisual,
  },
  {
    n: "03",
    eyebrow: "Automated Campaigns",
    accent: pillarAccents.campaigns,
    title: "Campaigns that go out on WhatsApp, not into a spam folder",
    body: "Images, videos and carousels for a new menu, a new outlet or a quiet Tuesday. Schedule it once and read the delivery, read and click rates per send.",
    chips: ["Rich media", "Scheduled sends", "Per-campaign analytics"],
    Visual: CampaignVisual,
  },
  {
    n: "04",
    eyebrow: "Online Reviews & Feedback",
    accent: pillarAccents.reviews,
    title: "Protect the rating, and find the dish that’s costing it",
    body: "Feedback is asked for the moment the bill is punched in. The happy tables go to Google. The unhappy ones reach your manager on WhatsApp — with the dish that caused it named.",
    chips: [
      "Google review routing",
      "Instant manager alerts",
      "Item-level reports",
    ],
    Visual: ReviewsVisual,
  },
];

/**
 * One card in the deck.
 *
 * The header strip is the part that matters to the stack: it is the only slice
 * of a covered card still visible, so it carries the pillar's accent and its
 * number. Four cards stacked means three coloured strips above the front one.
 */
function CardBody({ pillar }: { pillar: Pillar }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0F1116] shadow-[0_-18px_50px_-24px_rgba(0,0,0,0.95)] md:rounded-[34px]">
      <div
        className="flex items-center gap-2.5 px-6 py-3.5 md:px-11"
        style={{
          background: `linear-gradient(90deg, ${pillar.accent}2b 0%, ${pillar.accent}0d 48%, rgba(15,17,22,0) 100%)`,
          borderBottom: `1px solid ${pillar.accent}1f`,
        }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-[10.5px] font-bold"
          style={{ background: `${pillar.accent}2e`, color: pillar.accent }}
        >
          {pillar.n}
        </span>
        <span
          className="text-[11.5px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: pillar.accent }}
        >
          {pillar.eyebrow}
        </span>
      </div>

      <RevealGroup
        className="grid items-center gap-8 p-6 sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:gap-12 md:p-11"
        amount={0.12}
      >
        <div className="flex flex-col gap-4 md:gap-[18px]">
          <RevealItem>
            <h3 className="m-0 text-[23px] font-semibold leading-[1.16] tracking-[-0.025em] text-white sm:text-[27px] md:text-[33px] md:leading-[1.14]">
              {pillar.title}
            </h3>
          </RevealItem>

          <RevealItem>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[#9BA1AF] md:text-[15.5px]">
              {pillar.body}
            </p>
          </RevealItem>

          <RevealItem>
            <div className="flex flex-wrap gap-2 pt-1">
              {pillar.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full px-3.5 py-2 text-[12.5px]"
                  style={{
                    background: `${pillar.accent}1a`,
                    border: `1px solid ${pillar.accent}33`,
                    color: "#E9EDF5",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </RevealItem>
        </div>

        <RevealItem className="w-full">
          <pillar.Visual />
        </RevealItem>
      </RevealGroup>
    </div>
  );
}

export function FeatureStack() {
  return (
    <section id="features" className="scroll-mt-24 relative">
      <Reveal className="mx-auto flex max-w-[760px] flex-col items-center gap-4 px-5 pb-12 pt-16 text-center md:px-12 md:pt-[60px]">
        <h2 className="m-0 text-[30px] font-semibold leading-[1.14] tracking-[-0.028em] text-white md:text-[46px]">
          Everything that{" "}
          <span className="text-[#9EC0FF]">brings a diner back</span>
        </h2>
        <p className="m-0 text-[15px] leading-[1.6] text-[#9BA1AF] md:text-[17px]">
          Customer engagement and loyalty built for the F&amp;B industry &mdash;
          four things working together, not four tools you have to stitch.
        </p>
      </Reveal>

      {/* ── Desktop: the cards pile up, each one sticking a little lower so
             the coloured top edge of every card behind stays visible ── */}
      <div className="mx-auto hidden max-w-[1180px] px-12 pb-[14vh] md:block">
        {PILLARS.map((p, i) => (
          <div
            key={p.n}
            data-card
            // The stack only engages when there is room for a whole card
            // below the nav. On a short window a stuck card taller than the
            // viewport would put its own bottom permanently out of reach, so
            // there the cards simply flow and stay fully scrollable.
            className="[@media(min-height:820px)]:sticky"
            style={{
              // Each card rests 22px lower than the one behind it, so every
              // covered card keeps a 22px slice — its coloured header strip —
              // visible above the card in front.
              top: `${92 + i * 22}px`,
              // Later cards paint over earlier ones, which is what makes the
              // front of the deck the newest card.
              zIndex: i + 1,
              // ...and each sits slightly wider than the one behind, so the
              // deck tapers backwards like a hand of cards. Done in CSS
              // rather than a scroll tween: it is true at rest, on first
              // paint, and when animation frames are throttled.
              marginInline: `${(PILLARS.length - 1 - i) * 11}px`,
              // Cards after the first overlap the one before by a strip
              // height, so the deck closes up instead of leaving gaps.
              marginTop: i === 0 ? 0 : "-26px",
              // The gap below a card is the scroll distance before the next
              // one covers it. The last card has nothing to hand over to, so
              // its margin would just be dead space under the finished deck.
              marginBottom: i === PILLARS.length - 1 ? 0 : "36px",
            }}
          >
            <CardBody pillar={p} />
          </div>
        ))}
      </div>

      {/* ── Mobile: no pin, no wipe. Each card is its own block. ── */}
      <div className="flex flex-col gap-5 px-5 pb-16 md:hidden">
        {PILLARS.map((p) => (
          <Reveal key={p.n} amount={0.15}>
            <CardBody pillar={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
