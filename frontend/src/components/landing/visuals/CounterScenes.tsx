"use client";

import type { ReactNode } from "react";

/**
 * The three beats of the counter flow, drawn as product mockups.
 * Shared by the pinned desktop scene and the stacked mobile fallback, so the
 * two layouts can never drift apart.
 *
 * Each scene fills its stage: a primary mockup, a supporting column that
 * shows the same moment from the other side of the counter, and a footer
 * strip of real detail. Below `md` the supporting column and strip drop away
 * and the primary mockup centres on its own.
 */

function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" />
    </svg>
  );
}

/** The shell every scene shares: main area + footer strip. */
function Stage({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 sm:p-6">
      <div className="flex min-h-0 flex-1 items-center justify-center gap-4 md:justify-start md:gap-5">
        {children}
      </div>
      <div className="hidden shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm sm:flex">
        {footer}
      </div>
    </div>
  );
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.09em] text-white/60">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-white">{value}</span>
    </div>
  );
}

/* ── Beat 1 — the cashier punches the bill in ─────────────────────────── */
export function SceneCounter() {
  return (
    <Stage
      footer={
        <>
          <FooterStat label="Cashier" value="Ravi · Indiranagar" />
          <FooterStat label="Bills today" value="14" />
          <FooterStat label="Coins issued" value="1,732" />
        </>
      }
    >
      <div className="w-full max-w-[272px] shrink-0 rounded-[20px] bg-white p-5 shadow-[0_26px_60px_-20px_rgba(8,9,12,0.45)]">
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8D9098]">
            Add a bill
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#8D9098]">Customer phone</span>
            <div className="rounded-[11px] bg-[#f2f6fa] px-3.5 py-2.5 text-sm font-semibold text-[#1D2033]">
              +91 98765 4&bull;&bull;&bull;&bull;
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#8D9098]">Bill amount</span>
            <div className="rounded-[11px] bg-[#f2f6fa] px-3.5 py-2.5 text-sm font-semibold text-[#1D2033]">
              &#8377;620
            </div>
          </div>
          <div className="flex h-[42px] items-center justify-center rounded-[11px] bg-[#2135DD] text-[13.5px] font-semibold text-white">
            Credit coins
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 flex-col gap-3 md:flex">
        <div className="rounded-[18px] bg-[#0D0F14] p-4 shadow-[0_26px_60px_-20px_rgba(8,9,12,0.6)]">
          <div className="flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#6e86ff]/20">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9EC0FF" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="8.4" />
                <path d="M12 7.4v9.2M9.6 9.9h4.8M9.6 14.1h4.8" />
              </svg>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[13.5px] font-semibold text-white">+620 coins credited</span>
              <span className="text-[11.5px] text-[#6B7180]">&#8377;620 bill &middot; just now</span>
            </div>
          </div>
          <div className="my-3 h-px bg-white/[0.08]" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#9BA1AF]">New balance</span>
            <span className="text-[12.5px] font-semibold text-white">1,240 coins</span>
          </div>
        </div>

        <div className="rounded-[18px] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
          <span className="text-[11px] font-medium uppercase tracking-[0.09em] text-white/70">
            All it takes
          </span>
          <p className="m-0 mt-1.5 text-[15px] font-semibold leading-[1.35] text-white">
            Two fields, after the bill is settled
          </p>
          <p className="m-0 mt-1 text-[12px] leading-[1.45] text-white/70">
            No POS change, no new hardware, no training deck.
          </p>
        </div>
      </div>
    </Stage>
  );
}

/* ── Beat 2 — the card arrives on WhatsApp ───────────────────────────── */
export function SceneWhatsApp() {
  return (
    <Stage
      footer={
        <>
          <FooterStat label="Channel" value="WhatsApp Business" />
          <FooterStat label="Delivered" value="Under 5 seconds" />
          <FooterStat label="Install needed" value="None" />
        </>
      }
    >
      <div className="w-full max-w-[276px] shrink-0 overflow-hidden rounded-[20px] bg-[#ECE5DD] shadow-[0_26px_60px_-20px_rgba(8,9,12,0.5)]">
        <div className="flex items-center gap-2.5 bg-[#075E54] px-4 py-3">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#25D366]">
            <WhatsAppGlyph />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-semibold text-white">
              Avv&aring;&rsquo;s Cafe
            </span>
            <span className="text-[10.5px] text-white/60">Business account</span>
          </div>
        </div>
        <div className="px-3.5 py-4">
          <div className="rounded-[4px_14px_14px_14px] bg-white p-3 shadow-[0_1px_1.5px_rgba(8,9,12,0.12)]">
            <span className="block text-[12.5px] leading-[1.52] text-[#1D2033]">
              Thanks for visiting Avv&aring;&rsquo;s Cafe. You&rsquo;ve earned{" "}
              <b>620 coins</b> on today&rsquo;s bill of &#8377;620.
            </span>
            <div className="mt-2.5 border-t border-[#eceff3] pt-2.5 text-xs font-semibold text-[#2135DD]">
              View your reward card &rarr;
            </div>
            <div className="mt-1.5 text-right text-[9.5px] text-[#8D9098]">
              8:44 pm &#10003;&#10003;
            </div>
          </div>
        </div>
      </div>

      {/* What the link opens: their card, under the restaurant's branding. */}
      <div className="hidden min-w-0 flex-1 flex-col gap-3 md:flex">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_26px_60px_-20px_rgba(8,9,12,0.45)]">
          <div className="h-14 bg-gradient-to-br from-[#2135DD] to-[#9EC0FF]" />
          <div className="-mt-6 flex flex-col items-center gap-2 px-4 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-bold text-[#2135DD] shadow-md">
              A
            </div>
            <span className="text-[13px] font-semibold text-[#1D2033]">Avv&aring;&rsquo;s Cafe</span>
            <div className="mt-1 w-full rounded-xl bg-[#f2f6fa] p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[20px] font-bold leading-none text-[#1D2033]">1,240</span>
                <span className="text-[10.5px] text-[#8D9098]">coins</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e1e8f2]">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#9EC0FF] to-[#2135DD]" />
              </div>
              <span className="mt-1.5 block text-[10.5px] text-[#8D9098]">
                760 more to &#8377;300 cashback
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-[18px] border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]">
            <WhatsAppGlyph size={16} />
          </div>
          <span className="text-[12px] leading-[1.45] text-white">
            Opens in their browser &mdash; nothing to download
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* ── Beat 3 — they come back and the OTP unlocks the reward ──────────── */
export function SceneRedeem() {
  return (
    <Stage
      footer={
        <>
          <FooterStat label="Unlocked by" value="One-time code" />
          <FooterStat label="Logged against" value="Cashier & outlet" />
          <FooterStat label="Staff can self-redeem" value="No" />
        </>
      }
    >
      <div className="w-full max-w-[276px] shrink-0 rounded-[20px] bg-[#0D0F14] p-5 shadow-[0_26px_60px_-20px_rgba(8,9,12,0.6)]">
        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#6B7180]">
            Redeeming at the counter
          </span>
          <span className="text-[19px] font-semibold tracking-[-0.02em] text-white">
            &#8377;200 cashback
          </span>
          <div className="flex gap-2">
            {["4", "8", "2", "1"].map((d) => (
              <div
                key={d}
                className="flex h-[50px] flex-1 items-center justify-center rounded-xl border border-[#6e86ff]/35 bg-white/[0.06] text-xl font-bold text-white"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#16a34a]/15 px-3 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-[12px] font-medium text-[#86efac]">
              Verified &middot; &#8377;200 off this bill
            </span>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 flex-col gap-3 md:flex">
        <div className="rounded-[18px] bg-white p-4 shadow-[0_26px_60px_-20px_rgba(8,9,12,0.45)]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8D9098]">
            Redemption log
          </span>
          <div className="mt-2.5 flex flex-col">
            {[
              ["₹200 cashback", "Ravi · 8:46 pm", true],
              ["₹90 cashback", "Ravi · 7:12 pm", true],
              ["Free dessert", "Meena · 2:38 pm", true],
            ].map(([reward, who]) => (
              <div
                key={String(who)}
                className="flex items-center justify-between gap-3 border-b border-[#f1f4f9] py-2 last:border-b-0"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[12.5px] font-medium text-[#1D2033]">{reward}</span>
                  <span className="text-[10.5px] text-[#8D9098]">{who}</span>
                </div>
                <span className="shrink-0 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">
                  OTP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <span className="text-[12px] leading-[1.45] text-white">
            A reward can only be redeemed with a code sent to the customer&rsquo;s phone.
          </span>
        </div>
      </div>
    </Stage>
  );
}

export const BEATS = [
  {
    id: "counter",
    title: "Cashier enters the bill",
    highlight: "Cashier",
    body: "Phone number and amount, after the bill is settled. Coins land instantly.",
    Scene: SceneCounter,
  },
  {
    id: "whatsapp",
    title: "Message lands on WhatsApp",
    highlight: "WhatsApp",
    body: "Coins, rewards and expiry — under your branding, in their browser.",
    Scene: SceneWhatsApp,
  },
  {
    id: "redeem",
    title: "They come back to redeem",
    highlight: "redeem",
    body: "A one-time code from their phone unlocks the reward. Never without them.",
    Scene: SceneRedeem,
  },
] as const;
