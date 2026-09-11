"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * ScrollTrigger has to be registered exactly once, and only in the browser —
 * importing it during SSR throws on `document`.
 */
function register() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

type SceneOptions = {
  /**
   * Extra media query the scene requires, ANDed with the reduced-motion
   * check. Use it for scenes whose markup only exists at some widths — a
   * ScrollTrigger that pins a `display: none` element still reserves its
   * scroll distance, which shows up as a dead stretch of page.
   */
  media?: string;
  deps?: unknown[];
};

/**
 * Runs a GSAP setup function inside a context scoped to `scope`, so every
 * tween and ScrollTrigger it creates is reverted on unmount (and on a Fast
 * Refresh re-run). The body only runs when the visitor has not asked for
 * reduced motion; under `prefers-reduced-motion: reduce` nothing animates and
 * the markup stays in its final, readable state.
 *
 * GSAP's own matchMedia also re-runs the setup when the query flips, so a
 * resize across the breakpoint rebuilds the scene rather than leaving a stale
 * trigger behind.
 */
export function useScrollScene(
  setup: (ctx: { scope: HTMLElement }) => void,
  options: SceneOptions = {},
): RefObject<HTMLDivElement | null> {
  const { media } = options;
  // Spreading a caller-supplied array into the dependency list would let its
  // length vary between renders, which React rejects. Collapsing the extra
  // deps to one string keeps this list a fixed length forever.
  const depKey = JSON.stringify(options.deps ?? []);
  const scope = useRef<HTMLDivElement | null>(null);
  // Keeping `setup` in a ref means callers can pass an inline closure without
  // re-running the whole scene on every render.
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    register();

    const query = media
      ? `(prefers-reduced-motion: no-preference) and ${media}`
      : "(prefers-reduced-motion: no-preference)";

    const mm = gsap.matchMedia();
    mm.add(query, () => {
      const ctx = gsap.context(() => setupRef.current({ scope: el }), el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [media, depKey]);

  return scope;
}

export { gsap, ScrollTrigger };
