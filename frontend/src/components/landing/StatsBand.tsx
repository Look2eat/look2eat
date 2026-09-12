"use client";

import { useScrollScene, gsap } from "./motion/gsap";
import { RevealGroup, RevealItem } from "./motion/Reveal";
import { stats } from "./content";

/**
 * Headline numbers.
 *
 * Renders nothing until `stats` in content.ts holds real, verified figures —
 * a band of "[X]%" placeholders is worse than no band at all. When the
 * numbers arrive, any purely numeric prefix counts up on scroll.
 */
export function StatsBand() {
  const scope = useScrollScene(({ scope: root }) => {
    gsap.utils.toArray<HTMLElement>("[data-count]", root).forEach((el) => {
      const target = el.dataset.count;
      if (!target) return;
      const to = parseFloat(target);
      if (!Number.isFinite(to)) return;
      const suffix = target.replace(/^[\d.]+/, "");
      const obj = { n: 0 };
      gsap.to(obj, {
        n: to,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 74%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.n)}${suffix}`;
        },
      });
    });
  });

  if (!stats?.length) return null;

  return (
    <section
      ref={scope}
      aria-label="Results"
      className="relative border-y border-white/[0.06]"
    >
      <RevealGroup className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:grid-cols-3 md:px-12 md:py-[72px]">
        {stats.map((s) => (
          <RevealItem key={s.label}>
            <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <span
                data-count={s.value}
                className="text-[34px] font-bold leading-none tracking-[-0.03em] text-white md:text-[44px]"
              >
                {s.value}
              </span>
              <span className="text-[14px] leading-[1.5] text-[#9BA1AF] md:text-[15px]">
                {s.label}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
