"use client";

import type { ReactNode } from "react";

/**
 * The light container every feature visual sits in.
 *
 * This is what separates the stack from generic icon-and-text cards: each
 * pillar shows a real piece of the product, mounted on white so it reads as
 * a screenshot pinned to the dark card rather than decoration drawn into it.
 * One component owns the mount — chrome bar, ring, shadow, caption — so all
 * four visuals are framed identically and the stack looks like one system.
 */
export function LightPanel({
  label,
  accent,
  caption,
  children,
}: {
  /** Shown in the panel's chrome bar — the screen this visual is from. */
  label: string;
  accent: string;
  /** One line under the panel, explaining what the visual is showing. */
  caption?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-black/[0.06] shadow-[0_28px_64px_-24px_rgba(8,9,12,0.65)]">
        {/* Chrome bar — names the screen and carries the pillar's accent. */}
        <div className="flex items-center gap-2 border-b border-[#eef1f6] bg-[#f8fafc] px-3.5 py-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
          <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[#8D9098]">
            {label}
          </span>
        </div>
        <div className="p-3.5 sm:p-4">{children}</div>
      </div>

      {caption && (
        <p className="m-0 pl-1 text-[11.5px] leading-[1.45] text-[#6B7180]">{caption}</p>
      )}
    </div>
  );
}

/** A labelled row inside a light panel. */
export function Row({
  label,
  value,
  tone,
  strong,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-[7px]">
      <span className={`truncate text-[12.5px] ${strong ? "font-semibold text-[#1D2033]" : "text-[#4A4F5E]"}`}>
        {label}
      </span>
      <span
        className="shrink-0 text-[12.5px] font-semibold"
        style={{ color: tone ?? "#1D2033" }}
      >
        {value}
      </span>
    </div>
  );
}

/** The column header strip shared by the table-shaped visuals. */
export function TableHead({ cols }: { cols: string[] }) {
  return (
    <div
      className="grid gap-2 border-b border-[#eef1f6] pb-2"
      style={{ gridTemplateColumns: `minmax(0,1fr) repeat(${cols.length - 1}, 52px)` }}
    >
      {cols.map((c, i) => (
        <span
          key={c}
          className={`text-[9.5px] font-semibold uppercase tracking-[0.07em] text-[#A2A7B2] ${
            i > 0 ? "text-right" : ""
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
