import "server-only";
import { cache } from "react";

/**
 * The bill lives at {EXPRESS_API_URL}/public/bills/:billId — under the same
 * versioned API path as everything else this app proxies to, unauthenticated
 * because it's meant to be shared with a customer. Confirmed against a real
 * response from dev.backend.zuplin.in; the shape below is transcribed
 * directly from that sample, not guessed.
 */
function billsBaseUrl(): string {
  const raw = process.env.EXPRESS_API_URL || "http://localhost:5001/api/v1";
  return `${raw.replace(/\/$/, "")}/public/bills`;
}

export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number | null;
  /** Line total (unitPrice × quantity, minus any discount) — NOT the unit price. */
  amount: number;
  hsnSac: string | null;
  taxRate: number | null;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  cess: number | null;
}

export interface Bill {
  billNumber: string;
  type: string;
  issuedAt: string;
  business: {
    name: string;
    outlet: string;
    address: string | null;
    phone: string | null;
    gstin: string | null;
    state: string | null;
    pincode: string | null;
    logoUrl: string | null;
  };
  customer: {
    name: string | null;
    phone: string | null;
    email: string | null;
    gstin: string | null;
    address: string | null;
  };
  items: BillItem[];
  amounts: {
    subtotal: number;
    discount: number | null;
    taxableAmount: number | null;
    taxAmount: number | null;
    total: number;
    paymentMethod: string | null;
  };
  loyalty: {
    coinsEarned: number | null;
    coinsRedeemed: number | null;
    balance: number | null;
    rewardName: string | null;
    cashbackApplied: number | null;
  } | null;
}

interface RawBillResponse {
  data?: Bill;
}

export type FetchBillResult =
  | { status: "ok"; bill: Bill }
  | { status: "not-found" }
  | { status: "error"; message: string };

async function fetchBillUncached(billId: string): Promise<FetchBillResult> {
  const url = `${billsBaseUrl()}/${encodeURIComponent(billId)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    return { status: "error", message: "Could not reach the billing server." };
  }

  if (res.status === 404) return { status: "not-found" };
  if (!res.ok) return { status: "error", message: `Billing server returned ${res.status}.` };

  let raw: RawBillResponse;
  try {
    raw = await res.json();
  } catch {
    return { status: "error", message: "Billing server sent an invalid response." };
  }

  if (!raw.data || !Array.isArray(raw.data.items)) return { status: "not-found" };
  return { status: "ok", bill: raw.data };
}

/**
 * Memoized per request: generateMetadata and the page body both need the
 * same bill, and without this they'd fire two identical network calls
 * (this fetch is deliberately `cache: "no-store"`, so Next's own fetch
 * dedup doesn't apply — React's `cache()` covers exactly this case).
 */
export const fetchBill = cache(fetchBillUncached);
