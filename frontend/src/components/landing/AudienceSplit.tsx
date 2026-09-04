"use client";

import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";

function Tick({ tone = "#9EC0FF" }: { tone?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tone} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] shrink-0" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Bullet({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <Tick tone={tone} />
      <span className="text-[14.5px] leading-[1.55] text-[#C9CDD6]">{children}</span>
    </li>
  );
}

export function AudienceSplit() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
      <Reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
        <h2 className="m-0 text-[30px] font-semibold leading-[1.14] tracking-[-0.028em] text-[#1D2033] md:text-[46px]">
          One system. <span className="text-[#2135DD]">Two happy people.</span>
        </h2>
        <p className="m-0 text-[15px] leading-[1.6] text-[#6B7180] md:text-[17px]">
          The person behind the counter, and the person in front of it.
        </p>
      </Reveal>

      <RevealGroup className="grid gap-5 md:grid-cols-2 md:gap-[26px]">
        {/* ── For your counter ── */}
        <RevealItem className="h-full">
          <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-[26px] bg-[#0D0F14] p-7 md:p-[38px]">
            <div
              className="pointer-events-none absolute -right-10 -top-16 h-80 w-80"
              style={{ background: "radial-gradient(circle, rgba(33,53,221,0.42) 0%, rgba(13,15,20,0) 68%)" }}
            />

            <div className="relative flex flex-col gap-3">
              <h3 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
                For your counter
              </h3>
              {/* Petpooja is claimed here and in the feature stack — confirm the
                  integration exists on the backend before this ships. */}
              <div className="flex items-center gap-3 rounded-[14px] border border-white/[0.09] bg-white/[0.04] px-3.5 py-3">
                <span className="shrink-0 rounded-md border border-dashed border-white/20 px-2 py-1 text-[9px] tracking-[0.04em] text-[#6B7180]">
                  PETPOOJA
                </span>
                <span className="text-[13px] leading-[1.45] text-[#C9CDD6]">
                  Plugs into <strong className="font-semibold text-white">Petpooja</strong> and
                  your existing billing system
                </span>
              </div>
            </div>

            <ul className="relative m-0 flex list-none flex-col gap-2.5 p-0">
              <Bullet>Phone number, bill amount, done</Bullet>
              <Bullet>Runs on any phone, tablet or the billing PC</Bullet>
              <Bullet>Rewards locked behind the customer&rsquo;s OTP</Bullet>
            </ul>

            {/* The canvas had this panel absolutely positioned, which clipped
                it against the card's rounded edge. In flow it can never be
                cut off, at any width. */}
            <div className="relative mt-auto flex flex-col gap-4">
              <div className="rounded-[18px] border border-white/[0.09] bg-[#171A22] p-[18px]">
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[#6B7180]">
                    Add a bill
                  </span>
                  <div className="rounded-[10px] border border-white/[0.07] bg-[#0D0F14] px-3.5 py-2.5 text-[13px] text-[#C9CDD6]">
                    +91 98765 43210
                  </div>
                  <div className="flex items-center justify-between rounded-[10px] border border-white/[0.07] bg-[#0D0F14] px-3.5 py-2.5">
                    <span className="text-[13px] text-[#C9CDD6]">&#8377;620</span>
                    <span className="text-[11.5px] font-medium text-[#6f86ff]">+620 coins</span>
                  </div>
                </div>
              </div>

              <a
                href="#how-it-works"
                className="flex h-[46px] w-full items-center justify-center rounded-[10px] bg-[#2135DD] text-[14.5px] font-semibold text-white transition-transform hover:scale-[1.02] sm:w-[190px]"
              >
                See the cashier view
              </a>
            </div>
          </div>
        </RevealItem>

        {/* ── For your customer ── */}
        <RevealItem className="h-full">
          <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-[26px] bg-[#0D0F14] p-7 md:p-[38px]">
            <div
              className="pointer-events-none absolute -right-10 -top-16 h-80 w-80"
              style={{ background: "radial-gradient(circle, rgba(110,134,255,0.34) 0%, rgba(13,15,20,0) 68%)" }}
            />

            <div className="relative flex flex-col gap-3">
              <h3 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
                For your customer
              </h3>
              <p className="m-0 max-w-[330px] text-[14.5px] leading-[1.55] text-[#9BA1AF]">
                A loyalty card that lives in their browser, under your name &mdash; not an app
                they&rsquo;ll delete.
              </p>
            </div>

            <ul className="relative m-0 flex list-none flex-col gap-2.5 p-0">
              <Bullet>Coins credited the moment they pay</Bullet>
              <Bullet>Your logo, your colours, your terms</Bullet>
              <Bullet>Nothing to download, ever</Bullet>
            </ul>

            <div className="relative mt-auto flex flex-col gap-4">
              <div className="rounded-[18px] border border-white/[0.09] bg-[#171A22] p-[18px]">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-[#6B7180]">
                    Your coins
                  </span>
                  <span className="text-[30px] font-bold leading-none tracking-[-0.025em] text-white">
                    1,240
                  </span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#9EC0FF] to-[#2135DD]" />
                  </div>
                  <span className="text-[11.5px] text-[#6B7180]">760 to &#8377;300 cashback</span>
                </div>
              </div>

              <a
                href="#features"
                className="flex h-[46px] w-full items-center justify-center rounded-[10px] border border-white/[0.14] bg-white/[0.07] text-[14.5px] font-semibold text-white transition-colors hover:bg-white/[0.12] sm:w-[190px]"
              >
                See the card
              </a>
            </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
