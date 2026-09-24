import "server-only";

/**
 * Derives the Express backend's origin (protocol + host, no path) from
 * EXPRESS_API_URL, e.g. "https://backend.zuplin.in/api/v1" → "https://backend.zuplin.in".
 *
 * The bill endpoint lives at the backend's root (/b/:billId), not under the
 * versioned /api/v1 the rest of this app proxies to — so this can't reuse
 * EXPRESS_API_URL as-is. Deriving it from that same variable (rather than a
 * second hardcoded host) means Preview keeps talking to the preview backend
 * and Production to production, with nothing new to configure.
 */
function backendOrigin(): string {
  const raw = process.env.EXPRESS_API_URL || "http://localhost:5001/api/v1";
  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`EXPRESS_API_URL is not a valid URL: "${raw}"`);
  }
}

export interface BillItem {
  name: string;
  amount: number;
  qty: number;
  total: number;
}

export interface Bill {
  billId: string;
  items: BillItem[];
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  brandName?: string;
  outletName?: string;
  gstNo?: string;
  createdAt?: string;
}

/**
 * The shapes tolerated from `GET {backendOrigin}/b/:billId`, until the
 * backend's actual response is settled. All read the same handful of
 * fields; `readBillPayload` below is the one place that needs updating if
 * the backend picks a different contract.
 */
interface RawBillResponse {
  success?: boolean;
  billId?: string;
  id?: string;
  _id?: string;
  items?: BillItem[];
  totalAmount?: number;
  amount?: number;
  customerName?: string;
  name?: string;
  customerPhone?: string;
  phone?: string;
  brandName?: string;
  outletName?: string;
  gstNo?: string;
  createdAt?: string;
  date?: string;
  data?: RawBillResponse;
}

function readBillPayload(raw: RawBillResponse, fallbackId: string): Bill | null {
  // The interesting fields might be one level down under `data`.
  const body = raw.data ?? raw;
  if (!body.items || !Array.isArray(body.items)) return null;

  const totalAmount =
    body.totalAmount ?? body.amount ?? body.items.reduce((sum, i) => sum + (i.total ?? 0), 0);

  return {
    billId: body.billId ?? body.id ?? body._id ?? fallbackId,
    items: body.items,
    totalAmount,
    customerName: body.customerName ?? body.name,
    customerPhone: body.customerPhone ?? body.phone,
    brandName: body.brandName,
    outletName: body.outletName,
    gstNo: body.gstNo,
    createdAt: body.createdAt ?? body.date,
  };
}

export type FetchBillResult =
  | { status: "ok"; bill: Bill }
  | { status: "not-found" }
  | { status: "error"; message: string };

/**
 * Fetches a bill straight from the Express backend — this page is public
 * and needs no cashier/admin session, so it skips the authenticated
 * /api/proxy routes entirely rather than adding a pointless hop through one.
 */
export async function fetchBill(billId: string): Promise<FetchBillResult> {
  const url = `${backendOrigin()}/b/${encodeURIComponent(billId)}`;

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

  const bill = readBillPayload(raw, billId);
  if (!bill) return { status: "not-found" };
  return { status: "ok", bill };
}
