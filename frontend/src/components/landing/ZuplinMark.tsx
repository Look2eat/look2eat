"use client";

import { useId } from "react";

/** The Zuplin logomark — gradient tile with the fork/spoon glyph. */
export function ZuplinMark({ size = 32 }: { size?: number }) {
  // Two marks render on the page (nav + footer); a shared gradient id would
  // make the second one reference the first's def.
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect width="40" height="40" rx="8" fill={`url(#${id})`} />
      <rect x="8.4" y="9" width="22.2" height="6.4" rx="3.2" fill="#fff" />
      <rect
        x="6.9"
        y="26.4"
        width="28.5"
        height="6.4"
        rx="3.2"
        transform="rotate(-45 6.9 26.4)"
        fill="#fff"
      />
      <circle cx="21" cy="29.3" r="2.7" fill="#fff" />
      <circle cx="28.7" cy="29.3" r="2.7" fill="#fff" />
      <defs>
        <linearGradient id={id} x1="37" y1="38" x2="3" y2="1.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9EC0FF" />
          <stop offset="1" stopColor="#2135DD" />
        </linearGradient>
      </defs>
    </svg>
  );
}
