/**
 * Calls GET /loyalty/{outletId} (or /loyalty/all/{brandId} when the
 * selected scope is "all outlets") via our authenticated proxy
 * (/api/proxy/loyalty/...), which attaches the JWT from the httpOnly
 * cookie as Authorization: Bearer server-side. Same pattern as every
 * other authenticated call — never touches the token directly.
 */

export interface LoyaltyHistoryRow {
  id: string;
  date: string;
  phoneNumber: string;
  action: "Earned" | "Redeemed";
  points: string;
}

export interface LoyaltyHistoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoyaltyDashboardResponse {
  data: {
    kpis: {
      pointsRedeemed: number;
      pointsIssued: number;
      repeatCustomers: number;
    };
    customerRepeatRate: {
      visit1Time: number;
      visit2Times: number;
      visit3To5Times: number;
      visit6PlusTimes: number;
    };
    campaign: {
      isActive: boolean;
    };
    profileCompletion: number | null;
  };
  history: {
    data: LoyaltyHistoryRow[];
    pagination: LoyaltyHistoryPagination;
  };
}

export interface LoyaltyHistoryResponse {
  data: LoyaltyHistoryRow[];
  pagination: LoyaltyHistoryPagination;
}

/**
 * ---------------------------------------------------------------------------
 * Loyalty settings — service layer
 * ---------------------------------------------------------------------------
 * Raw fetch calls to the BFF proxy at /api/proxy/..., matching the rest of
 * the Zuplin services layer (no shared API client).
 * ---------------------------------------------------------------------------
 */

import { Milestone } from "@/types/loyalty";

const PROXY_BASE = "/api/proxy";

/**
 * Reads the response body exactly once (as text) then parses it.
 *
 * Using res.json() can trigger "body stream already read" when the server
 * returns a non-JSON or empty body, because the browser marks
 * bodyUsed = true after the first failed internal read attempt.
 * Reading as text first and then JSON.parse-ing avoids this entirely.
 */
async function parseOrThrow(res: Response, fallbackMessage: string) {
    const text = await res.text();

    let parsed: unknown = null;
    if (text) {
        try {
            parsed = JSON.parse(text);
        } catch {
            // Non-JSON body (plain text, empty, HTML error page…).
            // parsed stays null; error message extracted below if needed.
        }
    }

    if (!res.ok) {
        const body = parsed as Record<string, string> | null;
        const message = body?.message ?? body?.error ?? fallbackMessage;
        throw new Error(message);
    }

    return parsed;
}

/**
 * ---------------------------------------------------------------------------
 * Milestones — /api/v1/admin/milestones
 * ---------------------------------------------------------------------------
 */

export async function getMilestones(brandId: string): Promise<Milestone[]> {
    const res = await fetch(`${PROXY_BASE}/admin/brands/milestones`, {
        method: "GET",
    });
    // Cast to a loose record so we can safely probe nested keys without
    // TypeScript complaining — parseOrThrow returns unknown intentionally.
    const data = await parseOrThrow(res, "Couldn't load milestones.") as Record<string, unknown> | unknown[] | null;

    // Normalise every common API response shape into a plain array.
    // If none of the patterns match we log the actual shape in dev so
    // you can add it here, and return [] so the UI never crashes.
    const d = data as Record<string, unknown> | null;
    const candidates = [
        data,
        d?.milestones,
        d?.data,
        (d?.data as Record<string, unknown> | null)?.milestones,
        d?.rewards,
        (d?.data as Record<string, unknown> | null)?.rewards,
    ];

    const found = candidates.find(Array.isArray);
    if (found) return found as Milestone[];

    if (process.env.NODE_ENV === "development") {
        console.warn(
            "[getMilestones] Unexpected response shape — add it to the normaliser:",
            JSON.stringify(data, null, 2)
        );
    }
    return [];
}

export async function createMilestone(
    brandId: string,
    payload: Pick<Milestone, "name" | "coinsRequired" | "cashbackOffer">
): Promise<Milestone> {
    const res = await fetch(`${PROXY_BASE}/admin/brands/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, ...payload }),
    });
    return parseOrThrow(res, "Couldn't create milestone.") as Promise<Milestone>;
}

export async function updateMilestone(
    brandId: string,
    milestoneId: string,
    payload: Partial<Pick<Milestone, "name" | "coinsRequired" | "cashbackOffer">>
): Promise<Milestone> {
    const res = await fetch(`${PROXY_BASE}/admin/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: payload.name,
            cashbackOffer: payload.name,
            coinsRequired: payload.coinsRequired,
        }),
    });
    return parseOrThrow(res, "Couldn't update milestone.") as Promise<Milestone>;
}

export async function deleteMilestone(milestoneId: string): Promise<void> {
    const res = await fetch(`${PROXY_BASE}/admin/milestones/${milestoneId}`, {
        method: "DELETE",
    });
    await parseOrThrow(res, "Couldn't delete milestone.");
}

/**
 * Creates or updates every milestone in the list, depending on whether it
 * already has an id. Returns the list with server-assigned ids filled in.
 */
export async function syncMilestones(
    brandId: string,
    milestones: Milestone[]
): Promise<Milestone[]> {
    return Promise.all(
        milestones.map(async (milestone) => {
            const payload = {
                name: milestone.name,
                coinsRequired: milestone.coinsRequired,
                cashbackOffer: milestone.cashbackOffer,
            };
            if (milestone.id) {
                const updated = await updateMilestone(brandId, milestone.id, payload);
                return { ...milestone, ...updated };
            }
            const created = await createMilestone(brandId, payload);
            return { ...milestone, ...created };
        })
    );
}

/**
 * ---------------------------------------------------------------------------
 * Coin ratio — /api/v1/brands/coin-ratio
 * ---------------------------------------------------------------------------
 */

export async function setCoinRatio(brandId: string, coinRatioValue: number) {
    const res = await fetch(`${PROXY_BASE}/brands/coin-ratio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, coinRatioValue }),
    });
    return parseOrThrow(res, "Couldn't save the coin earning ratio.");
}

/**
 * ---------------------------------------------------------------------------
 * Brand images — /api/v1/brands/images
 * ---------------------------------------------------------------------------
 */

export async function uploadBrandImages(
    images: { logo?: File | null; banner?: File | null }
) {
    const formData = new FormData();
    if (images.logo) formData.append("logo", images.logo);
    if (images.banner) formData.append("banner", images.banner);

    const res = await fetch(`${PROXY_BASE}/brands/images`, {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type manually — the browser must set it so the
        // multipart boundary token is included automatically.
    });

    return parseOrThrow(res, "Couldn't upload brand images.");
}

/**
 * Converts a remote image URL (e.g. an Unsplash photo) into a File so it
 * can be sent through the same multipart upload as a user-picked file.
 */
export async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    const type = blob.type || "image/jpeg";
    return new File([blob], filename, { type });
}

/**
 * ---------------------------------------------------------------------------
 * Brand details — /api/v1/brands
 * ---------------------------------------------------------------------------
 */

export interface BrandDetailsPayload {
    name?: string;
    email?: string;
    phoneNumber?: string;
    description?: string;
    /**
     * Terms sent as a string array, one item per line — e.g.
     * ["Minimum purchase required.", "2 offers cannot be clubbed."]
     * The backend joins or stores them however it needs to.
     */
    terms?: string[];
    gst?: string;
    address?: string;
    primaryColor?: string;
    /** Days of inactivity before a customer's points expire. */
    pointsExpiryDays?: number;
}

export async function updateBrandDetails(payload: BrandDetailsPayload) {
    const res = await fetch(`${PROXY_BASE}/brands`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return parseOrThrow(res, "Couldn't save brand details.");
}

/**
 * Fetches the full loyalty dashboard (KPIs + repeat-rate breakdown +
 * campaign status + first page of history) for a single outlet, or for
 * all outlets combined under a brand.
 *
 * - Single outlet: GET /loyalty/{outletId}
 * - All outlets:   GET /loyalty/all/{brandId}
 *
 * Caller (the page) decides which to call based on OutletContext's
 * selectedOutlet — this function just takes whatever id segment it's given.
 */
export const getLoyaltyDashboard = async (
  scope: { type: "outlet"; outletId: string } | { type: "all"; brandId: string },
): Promise<LoyaltyDashboardResponse> => {
  const path =
    scope.type === "outlet"
      ? `/api/proxy/loyalty/${scope.outletId}`
      : `/api/proxy/loyalty/all/${scope.brandId}`;

  const res = await fetch(path, { method: "GET" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || data.error || "Could not load loyalty dashboard.",
    );
  }

  return data as LoyaltyDashboardResponse;
};

/**
 * Fetches a single page of reward history for an outlet. Only called
 * when a specific outlet is selected — there is no "all outlets" history
 * endpoint (the all-outlets dashboard response always returns an empty
 * history array, per backend contract).
 */
export const getLoyaltyHistory = async (
  outletId: string,
  page: number,
  limit = 10,
): Promise<LoyaltyHistoryResponse> => {
  const res = await fetch(
    `/api/proxy/loyalty/${outletId}/history?page=${page}&limit=${limit}`,
    { method: "GET" },
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || data.error || "Could not load reward history.",
    );
  }

  return data as LoyaltyHistoryResponse;
};