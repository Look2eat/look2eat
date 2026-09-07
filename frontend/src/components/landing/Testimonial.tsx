"use client";

import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { anies } from "./tokens";
import { testimonial } from "./content";

/**
 * A customer's own words, on a white card lit against the dark band.
 *
 * Renders nothing until `testimonial` in content.ts is filled in. Writing a
 * quote and attributing it to a real business would be fabricating a
 * testimonial, so the section simply stays out of the page until the real
 * one arrives.
 */
export function Testimonial() {
  if (!testimonial) return null;

  const { company, quote, personName, personRole, logoSrc, photoSrc, results } = testimonial;
  const initial = company.trim().charAt(0).toUpperCase();

  return (
    <section className="relative overflow-hidden bg-[#08090C]" aria-label={`What ${company} says`}>
      <div
        className="pointer-events-none absolute left-1/2 top-10 h-[480px] w-[900px] -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse at center, ${anies}26 0%, rgba(8,9,12,0) 66%)`,
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[1100px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(33,53,221,0.16) 0%, rgba(8,9,12,0) 68%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-5 py-16 md:px-12 md:py-24">
        <Reveal>
          <figure className="m-0 grid gap-9 rounded-[28px] bg-white p-7 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10 md:grid-cols-[minmax(0,1fr)_340px] md:items-center md:gap-14 md:rounded-[34px] md:p-[52px]">
            <div className="flex flex-col gap-6 md:gap-[26px]">
              <div className="flex items-center gap-3.5">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={`${company} logo`}
                    width={54}
                    height={54}
                    className="h-[54px] w-[54px] shrink-0 rounded-2xl object-contain"
                  />
                ) : (
                  <div
                    className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl text-xl font-bold"
                    style={{ background: `${anies}14`, color: anies }}
                    aria-hidden
                  >
                    {initial}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-[#1D2033]">{company}</span>
                  <span className="text-[13px] text-[#8D9098]">Live on Zuplin</span>
                </div>
              </div>

              <svg width="30" height="24" viewBox="0 0 30 24" fill="none" aria-hidden>
                <path
                  d="M0 24V13.4C0 6 3.9 1.3 11.6 0l1.1 4.4C8 5.6 5.8 8 5.8 11.5h4.9V24H0zm18.4 0V13.4C18.4 6 22.3 1.3 30 0l1.1 4.4C26.4 5.6 24.2 8 24.2 11.5h4.9V24h-10.7z"
                  fill={`${anies}33`}
                />
              </svg>

              <blockquote className="m-0">
                <p className="m-0 text-[20px] font-medium leading-[1.42] tracking-[-0.015em] text-[#1D2033] md:text-[27px]">
                  &ldquo;{quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="flex items-center gap-3.5">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={personName}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2f6fa] text-sm font-semibold text-[#6B7180]"
                    aria-hidden
                  >
                    {personName.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14.5px] font-semibold text-[#1D2033]">{personName}</span>
                  <span className="text-[13px] text-[#8D9098]">
                    {personRole}, {company}
                  </span>
                </div>
              </figcaption>
            </div>

            {results?.length ? (
              <RevealGroup className="flex flex-col gap-3">
                {results.slice(0, 3).map((r, i) => (
                  <RevealItem key={r.label}>
                    <div
                      className="flex flex-col gap-1.5 rounded-[20px] px-6 py-[22px]"
                      style={
                        i === 0
                          ? { background: `${anies}0f`, border: `1px solid ${anies}2e` }
                          : { background: "#F5F8FE", border: "1px solid rgba(33,53,221,0.09)" }
                      }
                    >
                      <span
                        className="text-[28px] font-bold leading-none tracking-[-0.025em] md:text-[30px]"
                        style={{ color: i === 0 ? anies : "#1D2033" }}
                      >
                        {r.value}
                      </span>
                      <span className="text-[13.5px] leading-[1.45] text-[#6B7180]">{r.label}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : null}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
