"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ZuplinMark } from "./ZuplinMark";
import { ease } from "./tokens";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  /**
   * Three states, driven purely by how far down the page you are — never by
   * scroll direction:
   *   top     — full width, transparent, so the hero reads as one dark field
   *   shrunk  — a floating pill, once the page has moved a little
   *   hidden  — gone, and it stays gone for the whole page
   *
   * Scrolling back up deliberately does NOT bring it back. It returns only
   * when you are actually at the top again, where a nav belongs.
   *
   * Everything animates through CSS transitions rather than framer-motion's
   * `animate` prop: animating `gap` and `padding` as bare numbers emits
   * unitless CSS, which the browser throws away — that is what collapsed the
   * link spacing. CSS transitions also keep working when the tab throttles
   * its animation frames.
   */
  const [shrunk, setShrunk] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Hysteresis on each threshold so a bar parked on the line can't flutter.
      setShrunk((was) => (was ? y > 40 : y > 80));
      // Never while the menu is open — a sheet sliding off screen with it
      // looks like a glitch.
      setHidden((was) => (open ? false : was ? y > 120 : y > 260));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (shrunk) setOpen(false);
  }, [shrunk]);

  // Escape closes the menu and returns focus to the button that opened it —
  // the expected behaviour for a disclosure, and the only way out for
  // keyboard users who opened it by mistake.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: ease.out }}
      className="font-poppins fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      <div
        className={[
          "overflow-hidden transition-all duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          hidden
            ? "-translate-y-[130%] opacity-0"
            : "translate-y-0 opacity-100",
          shrunk
            ? "mt-2.5 w-[min(960px,calc(100%-24px))] rounded-full bg-[#0C0E14]/75 shadow-[0_18px_44px_-22px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl"
            : "mt-0 w-full rounded-none bg-transparent ring-0",
        ].join(" ")}
      >
        <nav
          className={[
            "mx-auto flex max-w-[1440px] items-center justify-between transition-all duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            shrunk ? "px-5 py-2" : "px-5 py-[18px] md:px-12",
          ].join(" ")}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span
              className={`flex origin-left items-center transition-transform duration-[680ms] ${
                shrunk ? "scale-[0.82]" : "scale-100"
              }`}
            >
              <ZuplinMark />
            </span>
            <span
              className={`font-semibold tracking-[-0.01em] text-white transition-all duration-[680ms] ${
                shrunk ? "text-base" : "text-xl"
              }`}
            >
              Zuplin
            </span>
          </Link>

          <div
            className={`hidden items-center text-[#9BA1AF] transition-all duration-[680ms] lg:flex ${
              shrunk ? "gap-6 text-[13.5px]" : "gap-8 text-[14.5px]"
            }`}
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                // Padding lifts the hit area to the 24px WCAG 2.5.8 minimum
                // without changing where the text sits.
                className="rounded px-1 py-1.5 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Link
              href="/login"
              className={`hidden items-center rounded-[10px] bg-white/[0.07] px-5 text-sm font-medium text-white transition-all duration-[680ms] hover:bg-white/[0.12] sm:flex ${
                shrunk ? "h-9" : "h-[42px]"
              }`}
            >
              Log in
            </Link>
            <a
              href="#demo"
              className={`flex items-center rounded-[10px] bg-[#2135DD] px-4 text-[13px] font-semibold text-white shadow-[0_0_26px_-4px_rgba(74,99,255,0.75)] transition-all duration-[680ms] hover:scale-[1.03] md:px-[22px] md:text-sm ${
                shrunk ? "h-9" : "h-[42px]"
              }`}
            >
              Book a demo
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.07] text-white lg:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: ease.out }}
              className="overflow-hidden border-t border-white/[0.07] bg-[#08090C]/95 backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-3">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-[15px] text-[#C9CDD6] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2.5 text-[15px] text-[#C9CDD6] transition-colors hover:bg-white/5 hover:text-white sm:hidden"
                >
                  Log in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
