"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "../tokens";

/**
 * The landing page's two reveal primitives. Everything that simply needs to
 * arrive on scroll uses these; GSAP is reserved for the scenes that need a
 * scrubbed timeline (the counter stepper, the card stack), where a
 * progress-linked tween is the point.
 *
 * framer-motion honours `prefers-reduced-motion` for transform/opacity
 * animations on its own, so no extra guard is needed here.
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease.out } },
};

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds to hold before starting — for hero copy that follows a headline. */
  delay?: number;
  /** How much of the element must be visible before it fires. */
  amount?: number;
};

/** A single element that fades up once, the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, amount = 0.3 }: Props) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps a set of `RevealItem` children and staggers them. Use for lists,
 * chip rows, card grids — anywhere several siblings should cascade rather
 * than all arrive together.
 */
export function RevealGroup({ children, className, amount = 0.2 }: Props) {
  return (
    <motion.div
      className={className}
      variants={group}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** A child of `RevealGroup`. Inherits the parent's stagger. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
