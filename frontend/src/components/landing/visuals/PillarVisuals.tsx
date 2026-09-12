"use client";

import { LightPanel, TableHead } from "./LightPanel";
import { pillarAccents } from "../tokens";

/* ────────────────────────────────────────────────────────────────────────
   01 · Loyalty Program — the reward ladder the owner configures
   ──────────────────────────────────────────────────────────────────── */
export function LoyaltyVisual() {
  // Tiers deliberately line up with the reward card elsewhere on the page
  // (a 1,240-coin balance, 760 short of the ₹300 tier) and with the
  // ₹1 = 1 coin earn rate, so no two mockups contradict each other. The old
  // ladder returned ₹600 for 600 coins — the entire bill back.
  const tiers = [
    { pts: 500, reward: "₹50 cashback", pct: 100, unlocked: true },
    { pts: 1000, reward: "₹120 cashback", pct: 100, unlocked: true },
    { pts: 2000, reward: "₹300 cashback", pct: 62, unlocked: false },
  ];

  return (
    <LightPanel
      label="Loyalty · Reward ladder"
      accent={pillarAccents.loyalty}
      caption="Your earn rate and your tiers. Set once, runs on its own."
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2.5">
          <span className="text-[11px] text-[#8D9098]">Earn rate</span>
          <span className="text-[13px] font-semibold text-[#1D2033]">&#8377;1 spent = 1 coin</span>
        </div>

        <div className="flex flex-col gap-3">
          {tiers.map((t) => (
            <div key={t.pts.toLocaleString("en-IN")} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-bold text-[#1D2033]">
                  {t.pts.toLocaleString("en-IN")}
                  <span className="ml-1 text-[9px] font-medium text-[#A2A7B2]">COINS</span>
                </span>
                <span
                  className="text-[11.5px] font-medium"
                  style={{ color: t.unlocked ? "#16a34a" : "#8D9098" }}
                >
                  {t.reward}
                </span>
              </div>
              <div className="h-[5px] overflow-hidden rounded-full bg-[#eef1f6]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${t.pct}%`,
                    background: t.unlocked ? pillarAccents.loyalty : "#cbd3e0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ background: "rgba(240,180,41,0.1)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c98b06" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <path d="M12 8v5M12 16.5v.5M10.3 3.9 2.5 18a1.7 1.7 0 0 0 1.5 2.5h16a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a1.7 1.7 0 0 0-3 0z" />
          </svg>
          <span className="text-[11.5px] leading-[1.4] text-[#7a5b06]">
            <b className="font-semibold">142 customers</b> have points expiring in 7 days &mdash;
            reminder queued
          </span>
        </div>
      </div>
    </LightPanel>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   02 · Customer CRM — the segments the list splits into
   ──────────────────────────────────────────────────────────────────── */
export function CrmVisual() {
  const segments = [
    { name: "Regulars", count: "1,284", spend: "₹640", tone: "#16a34a" },
    { name: "Lapsing · 45 days", count: "312", spend: "₹520", tone: "#e2711d", flag: true },
    { name: "First-timers", count: "208", spend: "₹380", tone: "#4A4F5E" },
    { name: "Big spenders", count: "96", spend: "₹2,140", tone: "#4A4F5E" },
  ];

  return (
    <LightPanel
      label="CRM · Customer segments"
      accent={pillarAccents.crm}
      caption="Built from bills, not guesses. Every segment is a campaign audience."
    >
      <div className="flex flex-col gap-2">
        <TableHead cols={["Segment", "People", "Avg"]} />

        {segments.map((s) => (
          <div
            key={s.name}
            className="grid grid-cols-[minmax(0,1fr)_52px_52px] items-center gap-2 rounded-lg px-1.5 py-[7px]"
            style={s.flag ? { background: "rgba(167,139,250,0.1)" } : undefined}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              {s.flag && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: pillarAccents.crm }} />
              )}
              <span className="truncate text-[12.5px] text-[#1D2033]">{s.name}</span>
            </span>
            <span className="text-right text-[12.5px] font-semibold text-[#1D2033]">{s.count}</span>
            <span className="text-right text-[12.5px]" style={{ color: s.tone }}>
              {s.spend}
            </span>
          </div>
        ))}

        <div className="mt-1 flex items-center justify-between gap-2 rounded-xl bg-[#f8fafc] px-3 py-2.5">
          <span className="text-[11.5px] leading-[1.4] text-[#6B7180]">
            312 people haven&rsquo;t been in for 45 days
          </span>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold text-white"
            style={{ background: pillarAccents.crm }}
          >
            Win back
          </span>
        </div>
      </div>
    </LightPanel>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   03 · Automated Campaigns — what a send actually returned
   ──────────────────────────────────────────────────────────────────── */
export function CampaignVisual() {
  const funnel = [
    { label: "Sent", value: 1284, pct: 100 },
    { label: "Delivered", value: 1249, pct: 97 },
    { label: "Read", value: 1012, pct: 79 },
    { label: "Clicked", value: 386, pct: 30 },
  ];

  return (
    <LightPanel
      label="Campaigns · New menu launch"
      accent={pillarAccents.campaigns}
      caption="Every send reports what actually happened to it, not just that it went out."
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[22px] font-bold leading-none tracking-[-0.02em] text-[#1D2033]">
              30%
            </span>
            <span className="mt-1 text-[11px] text-[#8D9098]">clicked through</span>
          </div>
          <span className="rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10.5px] font-semibold text-[#16a34a]">
            +12% vs last send
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {funnel.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <span className="w-[62px] shrink-0 text-[11px] text-[#8D9098]">{f.label}</span>
              <div className="h-[18px] flex-1 overflow-hidden rounded-md bg-[#f1f4f9]">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${f.pct}%`,
                    background: `linear-gradient(90deg, ${pillarAccents.campaigns} 0%, #fdba74 100%)`,
                  }}
                />
              </div>
              <span className="w-[42px] shrink-0 text-right text-[11.5px] font-semibold text-[#1D2033]">
                {f.value.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2.5 border-t border-[#eef1f6] pt-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8D9098" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3 1.8" />
          </svg>
          <span className="text-[11.5px] text-[#6B7180]">
            Next: <b className="font-semibold text-[#1D2033]">Weekend brunch</b> &middot; Fri 11:00
          </span>
        </div>
      </div>
    </LightPanel>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   04 · Online Reviews & Feedback — the item-level report
   ──────────────────────────────────────────────────────────────────── */
export function ReviewsVisual() {
  const positive = [
    ["Lasagna", "200", "4.8"],
    ["Lime & Mint Mojito", "170", "4.3"],
  ];
  const negative = [
    ["Pesto Pasta", "20", "3.5"],
    ["Fried Chicken", "12", "3.2"],
  ];

  return (
    <LightPanel
      label="Feedback · Item report"
      accent={pillarAccents.reviews}
      caption="Which dishes earn the stars, and which quietly cost them."
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#16a34a]">
            Positive report
          </span>
          {positive.map(([item, orders, rating]) => (
            <div key={item} className="grid grid-cols-[minmax(0,1fr)_52px_42px] items-center gap-2">
              <span className="truncate text-[12.5px] text-[#1D2033]">{item}</span>
              <span className="text-right text-[11.5px] text-[#8D9098]">{orders}</span>
              <span className="text-right text-[12.5px] font-semibold text-[#16a34a]">{rating}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#eef1f6]" />

        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#dc2626]">
            Negative report
          </span>
          {negative.map(([item, complaints, rating]) => (
            <div key={item} className="grid grid-cols-[minmax(0,1fr)_52px_42px] items-center gap-2">
              <span className="truncate text-[12.5px] text-[#1D2033]">{item}</span>
              <span className="text-right text-[11.5px] text-[#8D9098]">{complaints}</span>
              <span className="text-right text-[12.5px] font-semibold text-[#dc2626]">{rating}</span>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ background: "rgba(244,114,182,0.1)" }}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25D366]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" />
            </svg>
          </div>
          <span className="text-[11.5px] leading-[1.4] text-[#8a1c53]">
            Manager alerted &middot; 2&#9733; on table 14, 8:42 pm
          </span>
        </div>
      </div>
    </LightPanel>
  );
}
