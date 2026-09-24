"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, X } from "lucide-react";
import { POS_CATALOG, POS_CATEGORIES, type PosCategory, type PosVariant } from "@/lib/pos/catalog";

export interface CartLine {
  /** PosVariant.id — the cart's own line key. */
  variantId: string;
  /** "Vetro — 12 × 12 in", what gets sent to the backend as the item name. */
  name: string;
  /** Unit price. */
  amount: number;
  qty: number;
}

interface Props {
  /** Fires on every cart change with the current lines and their sum. */
  onCartChange: (lines: CartLine[], total: number) => void;
}

const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Colour tokens as fixed literals rather than Tailwind's semantic gray-*
 * scale. This app remaps some gray shades (not all — gray-100 but not
 * gray-200, as far as testing showed) to near-black under dark mode for
 * dashboard surfaces, which is invisible on a light background and made
 * text disappear here. A cashier's product picker should look the same
 * light, high-contrast "till receipt" style regardless of the device's
 * system theme, so every colour below is a literal value, immune to that
 * remapping — the same approach already used on the public bill page.
 */

/**
 * The cashier's product picker: browse the hardcoded catalogue by category,
 * tap a size to add it, adjust quantity, see a running total. This is what
 * replaces free-typing a bill amount when the sale is off a known price
 * list rather than an arbitrary total.
 */
export default function PosOrderPanel({ onCartChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<PosCategory>(POS_CATEGORIES[0]);
  const [query, setQuery] = useState("");
  // Keyed by variant id so qty updates are O(1) and order doesn't matter;
  // rendered back out as an array (insertion order via Map) for the cart list.
  const [cart, setCart] = useState<Map<string, CartLine>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const byCategory = POS_CATALOG.filter((p) => p.category === activeCategory);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    // Searching filters across every category, not just the active tab —
    // a cashier looking up a specific size shouldn't have to guess which
    // tab it lives under first.
    return POS_CATALOG.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeCategory, query]);

  const lines = useMemo(() => Array.from(cart.values()), [cart]);
  const total = useMemo(() => lines.reduce((sum, l) => sum + l.amount * l.qty, 0), [lines]);
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  function commit(next: Map<string, CartLine>) {
    setCart(next);
    const nextLines = Array.from(next.values());
    onCartChange(
      nextLines,
      nextLines.reduce((sum, l) => sum + l.amount * l.qty, 0),
    );
  }

  function addVariant(productName: string, variant: PosVariant) {
    const next = new Map(cart);
    const existing = next.get(variant.id);
    if (existing) {
      next.set(variant.id, { ...existing, qty: existing.qty + 1 });
    } else {
      next.set(variant.id, {
        variantId: variant.id,
        name: `${productName} — ${variant.label}`,
        amount: variant.price,
        qty: 1,
      });
    }
    commit(next);
  }

  function setQty(variantId: string, qty: number) {
    const next = new Map(cart);
    if (qty <= 0) {
      next.delete(variantId);
    } else {
      const line = next.get(variantId);
      if (line) next.set(variantId, { ...line, qty });
    }
    commit(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Search + category tabs ── */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D9098]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl bg-[#f2f6fa] py-2.5 pl-9 pr-3 text-sm text-[#1D2033] outline-0 placeholder:text-[#8D9098]"
          />
        </div>

        {!query && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {POS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#3b2a26] text-white"
                    : "bg-[#f2f6fa] text-[#4A4F5E] hover:bg-[#e6ecf3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product list ── */}
      <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
        {visibleProducts.length === 0 && (
          <p className="py-6 text-center text-sm text-[#8D9098]">No products match &ldquo;{query}&rdquo;.</p>
        )}
        {visibleProducts.map((product) => (
          <div key={product.id} className="rounded-xl bg-[#f2f6fa] p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="font-medium text-[#1D2033]">{product.name}</span>
              {product.note && (
                // #4A4F5E rather than the #6B7180 used elsewhere in this file:
                // at 11px this text needs the small-text 4.5:1 AA threshold,
                // and #6B7180 on this card's #f2f6fa background measured
                // 4.4984 — technically under, not just a rounding artifact.
                <span className="shrink-0 text-[11px] text-[#4A4F5E]">{product.note}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const inCart = cart.get(variant.id);
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => addVariant(product.name, variant)}
                    className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                      inCart
                        ? "border-[#3b2a26] bg-[#3b2a26]/5"
                        : "border-[#e6ecf3] bg-white hover:border-[#c9d2e0]"
                    }`}
                  >
                    <span className="text-xs text-[#6B7180]">{variant.label}</span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1D2033]">
                      {formatRupees(variant.price)}
                      {inCart && (
                        <span className="rounded-full bg-[#3b2a26] px-1.5 py-0.5 text-[10px] font-bold text-white">
                          ×{inCart.qty}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cart summary bar ── */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        disabled={lines.length === 0}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-white transition-opacity ${
          lines.length === 0 ? "cursor-not-allowed bg-[#3b2a26]/40" : "bg-[#3b2a26]"
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <ShoppingCart className="h-4 w-4" />
          {itemCount === 0 ? "Cart is empty" : `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`}
        </span>
        <span className="font-semibold">{formatRupees(total)}</span>
      </button>

      {/* ── Cart detail sheet ── */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eef1f6] px-5 py-4">
              <span className="font-semibold text-[#1D2033]">Order</span>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X className="h-5 w-5 text-[#6B7180]" />
              </button>
            </div>

            <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto p-5">
              {lines.length === 0 && (
                <p className="py-8 text-center text-sm text-[#8D9098]">Nothing added yet.</p>
              )}
              {lines.map((line) => (
                <div key={line.variantId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#1D2033]">{line.name}</p>
                    <p className="text-xs text-[#6B7180]">
                      {formatRupees(line.amount)} × {line.qty} = {formatRupees(line.amount * line.qty)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(line.variantId, line.qty - 1)}
                      aria-label={`Decrease ${line.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f6fa] hover:bg-[#e6ecf3]"
                    >
                      <Minus className="h-3.5 w-3.5 text-[#1D2033]" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-[#1D2033]">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(line.variantId, line.qty + 1)}
                      aria-label={`Increase ${line.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f6fa] hover:bg-[#e6ecf3]"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#1D2033]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[#eef1f6] px-5 py-4">
              <span className="text-sm text-[#6B7180]">Total</span>
              <span className="text-lg font-bold text-[#1D2033]">{formatRupees(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
