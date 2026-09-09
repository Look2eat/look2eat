"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { BEATS } from "./visuals/CounterScenes";

/** How long a beat holds before the next one takes over, in ms. */
const HOLD_MS = 5200;

/** Splits a heading so one word can carry the brand colour. */
function Heading({ title, highlight }: { title: string; highlight: string }) {
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-[#2135DD]">{highlight}</span>
      {after}
    </>
  );
}

/**
 * The three steps at the counter.
 *
 * Built as a tab set, not a scroll animation. The steps advance on their own
 * so the section is never static, but they are real buttons: clicking or
 * arrowing to one shows it immediately, which is both more intuitive than
 * hijacking the scroll and the only version that works for keyboard and
 * screen-reader users. Autoplay stops the moment someone takes control.
 *
 * One layout serves every width — the earlier desktop/mobile split rendered
 * both copies into the DOM, which meant duplicate H2s and H3s on the page.
 */
export function CounterStepper() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const reduceMotion = useReducedMotion();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Anyone who asked for reduced motion gets a static first beat they can
  // still click through.
  const playing = autoplay && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % BEATS.length),
      HOLD_MS,
    );
    return () => window.clearInterval(id);
  }, [playing]);

  const select = useCallback((i: number) => {
    setActive(i);
    // The visitor is driving now; stop moving the ground under them.
    setAutoplay(false);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = BEATS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="how-it-works" className="scroll-mt-24 relative">
      <Reveal className="mx-auto max-w-[820px] px-5 pb-9 pt-6 text-center md:px-12 md:pb-12">
        <h2 className="m-0 text-[28px] font-semibold leading-[1.14] tracking-[-0.028em] text-[#1D2033] sm:text-[34px] md:text-[44px]">
          <span className="text-[#2135DD]">Three steps</span> at the counter.
          <br className="hidden sm:block" /> Nothing else changes.
        </h2>
        <p className="m-0 mx-auto mt-4 max-w-[560px] text-[15px] leading-[1.6] text-[#6B7180] md:text-[16.5px]">
          Pick a step to see what happens &mdash; or let it run.
        </p>
      </Reveal>

      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-5 pb-6 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:items-center md:gap-12 md:px-12 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-[64px]">
        {/* ── The steps ── */}
        <div
          role="tablist"
          aria-label="The three steps at the counter"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col gap-2"
        >
          {BEATS.map((beat, i) => {
            const isActive = i === active;
            return (
              <button
                key={beat.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`step-tab-${beat.id}`}
                aria-selected={isActive}
                aria-controls="step-panel"
                // Only the selected tab is in the tab order; arrow keys move
                // between them, which is the expected tablist behaviour.
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-500 md:p-5 ${
                  isActive
                    ? "border-[#2135DD]/25 bg-[#2135DD]/[0.055]"
                    : "border-transparent hover:border-[#e6ecf3] hover:bg-[#f7f9fc]"
                }`}
              >
                <span className="flex items-start gap-3.5">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold transition-colors duration-500 ${
                      isActive
                        ? "bg-[#2135DD] text-white"
                        : "bg-[#eef1f6] text-[#8D9098] group-hover:bg-[#e2e8f2]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span
                      className={`text-[18px] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-500 sm:text-[21px] md:text-[23px] ${
                        isActive ? "text-[#1D2033]" : "text-[#8D9098]"
                      }`}
                    >
                      <Heading title={beat.title} highlight={beat.highlight} />
                    </span>
                    <span
                      className={`text-[14px] leading-[1.55] transition-colors duration-500 md:text-[15px] ${
                        isActive ? "text-[#6B7180]" : "text-[#A9AEB8]"
                      }`}
                    >
                      {beat.body}
                    </span>
                  </span>
                </span>

                {/* Progress rail: fills over the hold so the autoplay is
                    legible rather than a surprise. Keyed on `active` so it
                    restarts cleanly each time the beat changes. */}
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
                  {isActive && (
                    <span
                      key={`${active}-${String(playing)}`}
                      className="block h-full origin-left bg-[#2135DD]"
                      style={
                        playing
                          ? { animation: `zp-step-progress ${HOLD_MS}ms linear forwards` }
                          : { width: "100%" }
                      }
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── The stage ── */}
        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${BEATS[active].id}`}
          className="relative h-[clamp(320px,52vh,460px)] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2135DD] via-[#4a63ff] to-[#9EC0FF]"
        >
          {BEATS.map((beat, i) => (
            <div
              key={beat.id}
              aria-hidden={i !== active}
              className="absolute inset-0 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={
                i === active
                  ? { opacity: 1, transform: "translateY(0)" }
                  : { opacity: 0, transform: "translateY(18px)", visibility: "hidden" }
              }
            >
              <beat.Scene />
            </div>
          ))}

          {/* Dots double as controls. */}
          <div className="absolute inset-x-6 bottom-5 flex items-center gap-2 md:inset-x-10">
            {BEATS.map((beat, i) => (
              <button
                key={beat.id}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show step ${i + 1}: ${beat.title}`}
                // The visible rail is 3px; the padding carries the hit area
                // past the 24px pointer-target minimum.
                className="group flex flex-1 items-center py-3"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-500 ${
                    i === active
                      ? "bg-white"
                      : "bg-white/30 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
