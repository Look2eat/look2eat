"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { ease } from "./tokens";
import { FaqStructuredData } from "./StructuredData";

export const FAQS = [
  {
    q: "Do I need to change my billing software?",
    a: "No. Zuplin runs alongside whatever you bill on today. Your cashier opens it in a browser on any phone, tablet or the billing machine and enters the amount after the bill is settled.",
  },
  {
    q: "Does the customer have to download an app?",
    a: "Never. Their loyalty card is a web page under your branding, opened from a link or a QR code. It works on any phone with a browser.",
  },
  {
    q: "Can my staff give away rewards to their friends?",
    a: "A reward can only be redeemed after a one-time code is sent to the customer's phone and read back at the counter. Every redemption is logged against a cashier and an outlet.",
  },
  {
    q: "How long does setup take?",
    a: "Sign up, add your outlet, set what ₹1 earns and what your rewards are, then create a cashier login. Most owners are live the same day.",
  },
  {
    q: "What do WhatsApp messages cost?",
    a: "₹2 per order. That is Meta's rate for delivering a WhatsApp message, and we pass it through at cost rather than marking it up — it comes out of a credit balance you top up when you want. You can see how many customers a campaign will reach, and what it will cost, before you send it.",
  },
  {
    q: "Who owns the customer data?",
    a: "You do. The diners who eat at your restaurant are your customers, not a marketplace's — and you can reach them directly whenever you like.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#e6ecf3] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[16px] font-semibold text-[#1D2033] md:text-[18px]">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: ease.out }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f2f6fa] text-[#2135DD]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="overflow-hidden"
          >
            <p className="m-0 max-w-[760px] pb-5 pr-10 text-[15px] leading-[1.62] text-[#6B7180] md:text-[15.5px]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pb-16 md:px-12 md:pb-24">
      <FaqStructuredData faqs={FAQS} />
      <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <div className="flex flex-col gap-3 md:sticky md:top-28">
            <h2 className="m-0 text-[28px] font-semibold leading-[1.14] tracking-[-0.028em] text-[#1D2033] md:text-[38px]">
              Questions restaurant owners ask us
            </h2>
            <p className="m-0 text-[15px] leading-[1.6] text-[#6B7180]">
              Still stuck? Write to{" "}
              <a href="mailto:contact@zuplin.in" className="inline-block rounded py-0.5 font-medium text-[#2135DD] hover:underline">
                contact@zuplin.in
              </a>{" "}
              or call{" "}
              <a href="tel:+919888032525" className="inline-block rounded py-0.5 font-medium text-[#2135DD] hover:underline">
                +91 98880 32525
              </a>
              .
            </p>
          </div>
        </Reveal>

        <Reveal amount={0.1}>
          <div className="rounded-[24px] border border-[#e6ecf3] bg-white px-6 md:px-8">
            {FAQS.map((f, i) => (
              <Item
                key={f.q}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
