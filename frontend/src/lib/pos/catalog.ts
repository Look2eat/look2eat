/**
 * Hardcoded POS catalog for the cashier panel's product picker.
 *
 * Transcribed from the Greenri "Lush Series" product catalogue (planters,
 * window planters and vases). Every price is the MRP per piece as printed
 * in the catalogue — there is no separate cost price or margin modelled
 * here, this is what the cashier charges.
 *
 * This is intentionally static data, not a backend-driven product list:
 * the ask was a hardcoded catalogue, so there is no admin UI to edit it.
 * To add, remove or re-price a product, edit this file directly.
 */

export type PosCategory = "Planters" | "Window Planters" | "Vase";

export interface PosVariant {
  /** Stable id: `${productId}__${variantIndex}`, used as the cart line key. */
  id: string;
  /** Dimension label as printed, e.g. "8 × 8 in" or "24 × 11 × 11 in". */
  label: string;
  /** MRP per piece, in rupees. */
  price: number;
  /** Units per pack, when the catalogue lists one (most are sold as singles). */
  packOf?: number;
}

export interface PosProduct {
  id: string;
  name: string;
  category: PosCategory;
  /** Printed callouts like "Base Plate Included" or a bundled inner pot. */
  note?: string;
  variants: PosVariant[];
}

/** Builds width×height variants, the common case across the catalogue. */
function whVariants(
  productId: string,
  rows: readonly [w: number, h: number, price: number, packOf?: number][],
): PosVariant[] {
  return rows.map(([w, h, price, packOf], i) => ({
    id: `${productId}__${i}`,
    label: `${w} × ${h} in`,
    price,
    packOf,
  }));
}

/** Builds length×width×height variants (window planters, Tulsi). */
function lwhVariants(
  productId: string,
  rows: readonly [l: number | string, w: number, h: number, price: number, packOf?: number][],
): PosVariant[] {
  return rows.map(([l, w, h, price, packOf], i) => ({
    id: `${productId}__${i}`,
    label: `${l} × ${w} × ${h} in`,
    price,
    packOf,
  }));
}

export const POS_CATALOG: PosProduct[] = [
  {
    id: "vetro",
    name: "Vetro",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("vetro", [
      [8, 8, 549, 10],
      [10, 10, 849, 5],
      [12, 12, 1149, 5],
      [15, 15, 1549, 3],
      [18, 18, 2449, 1],
      [22, 22, 4399, 1],
      [26, 26, 6599, 1],
    ]),
  },
  {
    id: "vetro-vase",
    name: "Vetro Vase",
    category: "Vase",
    variants: whVariants("vetro-vase", [[17, 26, 4399, 1]]),
  },
  {
    id: "vetro-window",
    name: "Vetro Window",
    category: "Window Planters",
    note: "Base plate included",
    variants: lwhVariants("vetro-window", [
      [24, 11, 11, 2949],
      [30, 12, 12, 3849],
      [36, 13, 14, 5499],
    ]),
  },
  {
    id: "grandeur",
    name: "Grandeur",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("grandeur", [
      [12, 12, 1299, 4],
      [16, 16, 2199, 1],
      [20, 20, 3649, 1],
      [24, 24, 7149, 1],
    ]),
  },
  {
    id: "i-grandeur",
    name: "I Grandeur",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("i-grandeur", [
      [11.5, 18, 1899, 3],
      [15.5, 24, 3199, 1],
      [20, 30, 5499, 1],
    ]),
  },
  {
    id: "i-aura",
    name: "I Aura",
    category: "Planters",
    note: "Matt black & rose gold metal strip",
    variants: whVariants("i-aura", [
      [12, 25, 3299, 1],
      [15, 30, 5749, 1],
    ]),
  },
  {
    id: "flutex-round",
    name: "Flutex Round",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("flutex-round", [
      [12, 12, 1449, 1],
      [15, 15, 2149, 1],
      [18, 18, 3299, 1],
    ]),
  },
  {
    id: "flutex-window",
    name: "Flutex Window",
    category: "Window Planters",
    note: "Base plate included",
    variants: lwhVariants("flutex-window", [[30, 10.5, 14.5, 3949]]),
  },
  {
    id: "legacy",
    name: "Legacy",
    category: "Planters",
    variants: whVariants("legacy", [
      [12, 12, 1449, 1],
      [16, 16, 3099, 1],
      [20, 20, 5399, 1],
    ]),
  },
  {
    id: "i-legacy",
    name: "I Legacy",
    category: "Planters",
    variants: whVariants("i-legacy", [[16, 28.5, 4399, 1]]),
  },
  {
    id: "legacy-window",
    name: "Legacy Window",
    category: "Window Planters",
    variants: lwhVariants("legacy-window", [
      [24, 10, 10, 2199],
      [36, 14, 14, 4949],
    ]),
  },
  {
    id: "linear",
    name: "Linear",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("linear", [
      [12, 12, 1199, 5],
      [15, 15, 1899, 1],
      [18, 18, 2699, 1],
    ]),
  },
  {
    id: "face-lift",
    name: "Face Lift",
    category: "Planters",
    variants: whVariants("face-lift", [
      [9.5, 10, 849, 6],
      [14, 15, 2049, 1],
    ]),
  },
  {
    id: "castle",
    name: "Castle",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("castle", [
      [10, 10, 799, 10],
      [12, 12, 1149, 6],
      [14, 14, 1599, 1],
      [16, 16, 2249, 1],
      [18, 18, 3099, 1],
      [20, 20, 3849, 1],
    ]),
  },
  {
    id: "i-castle",
    name: "I-Castle",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("i-castle", [
      [12, 18, 1849, 1],
      [16, 26, 3899, 1],
      [22, 36, 9899, 1],
    ]),
  },
  {
    id: "cube-x",
    name: "Cube X",
    category: "Planters",
    variants: whVariants("cube-x", [
      [6, 6, 449, 12],
      [8, 8, 899, 6],
      [10, 10, 1149, 4],
      [14, 14, 2449, 1],
    ]),
  },
  {
    id: "cube-x-window",
    name: "Cube X Window",
    category: "Window Planters",
    variants: lwhVariants("cube-x-window", [
      [24, 12, 12, 3299],
      [30, 12, 12, 3849],
      [36, 13, 13, 5499],
      ["24S", 6, 7, 1649],
    ]),
  },
  {
    id: "casa",
    name: "Casa",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("casa", [
      [10, 10, 699, 5],
      [12, 12, 1049, 5],
      [16, 16, 1949, 1],
      [20, 20, 3049, 1],
    ]),
  },
  {
    id: "casa-window",
    name: "Casa Window",
    category: "Window Planters",
    note: "Base plate included",
    variants: lwhVariants("casa-window", [
      [18, 8, 8, 1099, 6],
      [24, 11, 11, 2299, 3],
    ]),
  },
  {
    id: "corso",
    name: "Corso",
    category: "Planters",
    variants: whVariants("corso", [
      [15, 8.5, 899, 7],
      [20, 10, 1649, 1],
      [25, 12, 2649, 1],
      [30, 13, 3749, 1],
    ]),
  },
  {
    id: "tulsi",
    name: "Tulsi",
    category: "Planters",
    variants: lwhVariants("tulsi", [
      [10, 10, 10, 1099],
      [12, 12, 12, 1549],
    ]),
  },
  {
    id: "loopix",
    name: "Loopix",
    category: "Planters",
    note: "Includes 6 inch inner pot",
    variants: whVariants("loopix", [[20, 8, 849, 1]]),
  },
  {
    id: "avenue",
    name: "Avenue",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("avenue", [
      [10, 8, 649, 10],
      [12, 10, 899, 5],
      [14, 10.5, 1399, 5],
      [18, 14.5, 1799, 1],
      [22, 18.5, 3299, 1],
      [26, 22.5, 4949, 1],
    ]),
  },
  {
    id: "andora",
    name: "Andora",
    category: "Planters",
    note: "Base plate included",
    variants: whVariants("andora", [
      [8, 9, 549, 10],
      [12, 12, 999, 5],
      [16, 18, 2549, 1],
      [20, 22, 4249, 1],
      [24, 26, 5849, 1],
      [28, 30, 8449, 1],
    ]),
  },
  {
    id: "estate",
    name: "Estate",
    category: "Planters",
    variants: whVariants("estate", [[20, 32, 5499, 1]]),
  },
  {
    id: "terreno",
    name: "Terreno",
    category: "Planters",
    variants: whVariants("terreno", [
      [6, 6, 349, 12],
      [10, 11, 599, 8],
      [14, 14, 1049, 1],
      [17, 18, 2199, 1],
    ]),
  },
  {
    id: "i-terreno",
    name: "I Terreno",
    category: "Planters",
    variants: whVariants("i-terreno", [
      [15, 21, 1949, 1],
      [19, 25, 3649, 1],
    ]),
  },
  {
    id: "giga",
    name: "Giga",
    category: "Planters",
    variants: whVariants("giga", [
      [22, 15, 3299, 1],
      [27, 18, 4399, 1],
      [32, 22, 7149, 1],
    ]),
  },
];

/** Every category in catalogue order, for building the picker's tabs. */
export const POS_CATEGORIES: PosCategory[] = ["Planters", "Window Planters", "Vase"];
