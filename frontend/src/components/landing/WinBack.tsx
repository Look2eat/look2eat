"use client";

import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { useScrollScene, gsap } from "./motion/gsap";

function WhatsAppGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" />
    </svg>
  );
}

/**
 * One column of the flow. Every card uses the same vertical rhythm —
 * step header, then a fixed gap to the body copy, then the visual pinned to
 * the bottom of the card. In the canvas these three were spaced by hand and
 * drifted out of line; here the rhythm is one set of classes they all share.
 */
function Step({
  n,
  title,
  body,
  children,
}: {
  n: string;
  title: string;
  body: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[26px] border border-white/[0.08] bg-[#0F1116] p-6 md:p-7">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.07] text-[11px] font-bold text-[#9BA1AF]">
            {n}
          </span>
          <span className="text-[15.5px] font-semibold leading-tight text-white">{title}</span>
        </div>
        <p className="m-0 text-sm leading-[1.55] text-[#9BA1AF]">{body}</p>
      </div>

      <div className="mt-auto">{children}</div>
    </div>
  );
}

export function WinBack() {
  const scope = useScrollScene(({ scope: root }) => {
    // The alert is the emotional beat of the section — give it one pulse as
    // it lands, so the eye starts on the left column.
    gsap.fromTo(
      root.querySelector("[data-alert]"),
      { scale: 0.97 },
      {
        scale: 1,
        duration: 0.7,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
      },
    );
  });

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-44 -top-28 h-[520px] w-[740px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.14) 0%, rgba(8,9,12,0) 66%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-10 px-5 pb-20 pt-10 md:gap-12 md:px-12 md:pb-[110px] md:pt-14">
        <Reveal className="flex max-w-[720px] flex-col gap-3.5">
          <span className="text-[12.5px] font-medium uppercase tracking-[0.12em] text-[#f87171]">
            Winning the table back
          </span>
          <h3 className="m-0 text-[28px] font-semibold leading-[1.16] tracking-[-0.028em] text-white md:text-[38px]">
            One bad plate doesn&rsquo;t have to be their last visit.
          </h3>
          <p className="m-0 text-[15px] leading-[1.62] text-[#9BA1AF] md:text-[16.5px]">
            The complaint arrives with the dish named and the bill attached. One tap sends an
            apology and a reward &mdash; and the same complaint shows up in your item report
            before it turns into a habit.
          </p>
        </Reveal>

        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {/* ── 01 ── */}
          <RevealItem className="h-full">
            <Step
              n="01"
              title="It reaches you, not Google"
              body={
                <>
                  A 1&ndash;3 star rating never leaves your dashboard. The alert names the
                  dish, the bill and how many times they&rsquo;ve been in.
                </>
              }
            >
              <div
                data-alert
                className="flex flex-col gap-3.5 rounded-[18px] bg-gradient-to-br from-[#E33B3B] to-[#C22B2B] p-[18px] shadow-[0_18px_40px_-18px_rgba(227,59,59,0.55)]"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white/20">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9.2" />
                        <path d="M8.4 15.4c.9-1.2 2.1-1.8 3.6-1.8s2.7.6 3.6 1.8M9.2 9.4h.01M14.8 9.4h.01" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-white">
                        Table 14 &middot; 3rd visit
                      </span>
                      <span className="text-[11px] text-white/75">&#8377;3,204 &middot; 9:59 pm</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[13px] text-white">&#9733;&#9733;&#9734;&#9734;&#9734;</span>
                </div>

                <p className="m-0 text-[15px] font-medium leading-[1.42] text-white">
                  &ldquo;The paneer tikka came out cold and the noodles were too salty.&rdquo;
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-medium text-white">
                    Reason &middot; Food
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10.5px] font-medium text-white">
                    Heard of us &middot; Walking by
                  </span>
                </div>

                <div className="flex h-[38px] items-center justify-center rounded-[11px] bg-[#14A05A] text-[13px] font-semibold text-white">
                  Take action
                </div>
              </div>
            </Step>
          </RevealItem>

          {/* ── 02 ── */}
          <RevealItem className="h-full">
            <Step
              n="02"
              title="One tap sends them back a reason"
              body="Apologise from the dashboard and attach coins to it. It goes out on WhatsApp, under your name, while they still remember the meal."
            >
              <div className="overflow-hidden rounded-[18px] bg-[#ECE5DD] shadow-[0_18px_40px_-18px_rgba(8,9,12,0.6)]">
                <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                    <WhatsAppGlyph />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-white">Avv&aring;&rsquo;s Cafe</span>
                    <span className="text-[10px] text-white/60">Business account</span>
                  </div>
                </div>
                <div className="px-3 py-3.5">
                  <div className="rounded-[4px_14px_14px_14px] bg-white p-3 shadow-[0_1px_1.5px_rgba(8,9,12,0.12)]">
                    <span className="block text-[12.5px] leading-[1.52] text-[#1D2033]">
                      Apologies for your last visit &mdash; that&rsquo;s not how we cook.
                      We&rsquo;ve put <b>500 bonus coins</b> on your card for the next one.
                    </span>
                    <div className="mt-2.5 border-t border-[#eceff3] pt-2.5 text-xs font-semibold text-[#2135DD]">
                      View reward &rarr;
                    </div>
                    <div className="mt-1.5 text-right text-[9.5px] text-[#8D9098]">
                      10:06 pm &#10003;&#10003;
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </RevealItem>

          {/* ── 03 ── */}
          <RevealItem className="h-full">
            <Step
              n="03"
              title="The kitchen sees the pattern"
              body="Every complaint is tied to the items on that bill, so a dish that keeps going wrong shows up as a number instead of a hunch."
            >
              <div className="flex flex-col gap-3 rounded-[18px] border border-white/[0.07] bg-[#14161C] p-[18px]">
                <span className="text-xs font-semibold text-white">
                  Items with a <span className="text-[#f87171]">negative report</span>
                </span>

                <div className="grid grid-cols-[minmax(0,1fr)_44px_42px] gap-2 border-b border-white/[0.07] pb-2">
                  {["Item", "Compl.", "Rating"].map((h, i) => (
                    <span
                      key={h}
                      className={`text-[9.5px] font-semibold uppercase tracking-[0.07em] text-[#565C6B] ${
                        i > 0 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {[
                  ["Pesto Pasta", "20", "3.5"],
                  ["Fried Chicken", "12", "3.2"],
                  ["Paneer Tikka", "6", "3.0"],
                ].map(([item, complaints, rating]) => (
                  <div key={item} className="grid grid-cols-[minmax(0,1fr)_44px_42px] items-center gap-2">
                    <span className="text-[13px] text-[#C9CDD6]">{item}</span>
                    <span className="text-right text-[13px] text-[#9BA1AF]">{complaints}</span>
                    <span className="text-right text-[13px] font-semibold text-[#f87171]">{rating}</span>
                  </div>
                ))}

                <div className="mt-0.5 h-px bg-white/[0.07]" />

                <div className="flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M3 17l6-6 4 4 7-7M14 8h6v6" />
                  </svg>
                  <span className="text-[11.5px] leading-[1.45] text-[#9BA1AF]">
                    Positive report ranks your winners the same way.
                  </span>
                </div>
              </div>
            </Step>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
