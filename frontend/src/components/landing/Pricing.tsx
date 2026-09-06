"use client";

import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { plans } from "./content";
import { site } from "@/lib/site";

function Tick({ tone }: { tone: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tone}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 mx-auto max-w-[1180px] px-5 py-16 md:px-12 md:py-24"
    >
      <Reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
        <h2 className="m-0 text-[30px] font-semibold leading-[1.14] tracking-[-0.028em] text-[#1D2033] md:text-[46px]">
          One price per outlet.{" "}
          <span className="text-[#2135DD]">No cut of your sales.</span>
        </h2>
        <p className="m-0 max-w-[620px] text-[15px] leading-[1.6] text-[#6B7180] md:text-[17px]">
          Your subscription covers the platform. WhatsApp messages are charged separately at
          &#8377;2 per order &mdash; that is Meta&rsquo;s own rate for sending them, passed
          straight through from a credit balance you top up whenever you want.
        </p>
      </Reveal>

      <RevealGroup className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <RevealItem key={plan.name} className="h-full">
            <div
              className={`relative flex h-full flex-col gap-5 overflow-hidden rounded-[24px] p-7 md:p-8 ${
                plan.featured
                  ? "bg-[#0D0F14] shadow-[0_28px_60px_-30px_rgba(33,53,221,0.6)]"
                  : "border border-[#e6ecf3] bg-white"
              }`}
            >
              {plan.featured && (
                <div
                  className="pointer-events-none absolute -right-14 -top-16 h-60 w-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(33,53,221,0.5) 0%, rgba(13,15,20,0) 66%)",
                  }}
                />
              )}

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-[17px] font-semibold ${plan.featured ? "text-white" : "text-[#1D2033]"}`}
                  >
                    {plan.name}
                  </span>
                  <span
                    className={`text-[13px] ${plan.featured ? "text-[#9BA1AF]" : "text-[#8D9098]"}`}
                  >
                    {plan.blurb}
                  </span>
                </div>
                {plan.featured && (
                  <span className="shrink-0 rounded-full bg-[#2135DD] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
                    Popular
                  </span>
                )}
              </div>

              <div className="relative flex items-baseline gap-1.5">
                <span
                  className={`font-bold tracking-[-0.025em] ${
                    plan.price
                      ? "text-[32px] md:text-[34px]"
                      : "text-[26px] md:text-[28px]"
                  } ${plan.featured ? "text-white" : "text-[#1D2033]"}`}
                >
                  {/* No invented figures: until a real price is set in
                      content.ts the plan asks people to get in touch. */}
                  {plan.price ?? "Talk to us"}
                </span>
                {plan.price && plan.period && (
                  <span
                    className={`text-[13.5px] ${plan.featured ? "text-[#9BA1AF]" : "text-[#8D9098]"}`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <a
                // Starter has a working self-serve signup, which is what the
                // hero's "Start free" promises; the larger plans need a
                // conversation, so they open an enquiry instead.
                href={
                  plan.name === "Starter"
                    ? "/signup"
                    : `mailto:${site.email}?subject=${encodeURIComponent(
                        `Zuplin ${plan.name} plan`,
                      )}`
                }
                className={`relative flex h-[46px] items-center justify-center rounded-[10px] text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  plan.featured
                    ? "bg-[#2135DD] text-white"
                    : "border border-[#e6ecf3] bg-[#f2f6fa] text-[#1D2033]"
                }`}
              >
                {plan.name === "Starter"
                  ? "Start free"
                  : `Ask about ${plan.name}`}
              </a>

              <div className="relative flex flex-col gap-2.5 pt-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Tick tone={plan.featured ? "#9EC0FF" : "#2135DD"} />
                    <span
                      className={`text-[14.5px] leading-[1.5] ${plan.featured ? "text-[#C9CDD6]" : "text-[#4A4F5E]"}`}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
