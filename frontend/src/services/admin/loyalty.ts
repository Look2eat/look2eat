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