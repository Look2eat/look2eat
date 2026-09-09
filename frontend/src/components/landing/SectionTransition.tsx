"use client";

import { useScrollScene, gsap } from "./motion/gsap";

/**
 * The beat between two sections.
 *
 * A hairline that draws outward from the centre as you reach it, with a small
 * glowing node riding the middle. It gives each section a deliberate ending
 * instead of one band butting straight into the next, and it costs one
 * element — no extra scroll height beyond its own padding.
 */
export function SectionTransition({
  tone = "dark",
  size = "md",
}: {
  /** Match the band the divider sits on, so the hairline stays visible. */
  tone?: "dark" | "light";
  size?: "sm" | "md";
}) {
  const scope = useScrollScene(({ scope: root }) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 94%", end: "top 52%", scrub: 0.6 },
    });

    tl.fromTo("[data-divider-line]", { scaleX: 0 }, { scaleX: 1, ease: "power2.out" }, 0)
      .fromTo(
        "[data-divider-node]",
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power2.out" },
        0.25,
      );

    // A slow breath on the node once it has arrived, so a divider parked in
    // the viewport isn't completely inert.
    gsap.to("[data-divider-node]", {
      boxShadow: "0 0 22px 3px rgba(74,99,255,0.55)",
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  const line =
    tone === "dark"
      ? "linear-gradient(90deg, rgba(33,53,221,0) 0%, rgba(110,134,255,0.55) 50%, rgba(33,53,221,0) 100%)"
      : "linear-gradient(90deg, rgba(33,53,221,0) 0%, rgba(33,53,221,0.28) 50%, rgba(33,53,221,0) 100%)";

  return (
    <div
      ref={scope}
      aria-hidden
      className={`relative flex items-center justify-center ${
        size === "sm" ? "py-8 md:py-10" : "py-12 md:py-16"
      }`}
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 md:px-12">
        <div
          data-divider-line
          className="h-px w-full origin-center"
          style={{ background: line }}
        />
        <div
          data-divider-node
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
          style={{
            background: tone === "dark" ? "#6f86ff" : "#2135DD",
            boxShadow: "0 0 12px 1px rgba(74,99,255,0.4)",
          }}
        />
      </div>
    </div>
  );
}
