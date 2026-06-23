/**
 * services/admin/feedbackDashboard.ts
 *
 * All calls go through the Next.js BFF proxy (/api/proxy/...) which attaches
 * the httpOnly JWT cookie automatically — never call the backend directly from
 * the browser.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeedbackReview {
  id: string;
  transactionId: string;
  brandId: string;
  outletId: string;
  phoneNumber: string;
  rating: number;
  categories: string[] | null;
  feedback: string;
  googleReviewClicked: boolean;
  ownerNotified: boolean;
  ownerNotifiedAt: string | null;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedbackDashboardData {
  totalFeedback: number;
  averageRating: number;
  positiveFeedback: number;
  neutralFeedback: number;
  negativeFeedback: number;
  googleReviews: number;
  feedbackEnabled: boolean;
  reviews: FeedbackReview[];
  pagination: FeedbackPagination;
}

interface ApiResponse {
  data: FeedbackDashboardData;
}

export interface FetchFeedbackParams {
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

/** Called when selectedOutlet is a specific outlet ID */
export async function fetchOutletFeedbackDashboard(
  outletId: string,
  { page = 1, limit = 5 }: FetchFeedbackParams = {}
): Promise<FeedbackDashboardData> {
  const res = await fetch(
    `/api/proxy/feedback/dashboard/outlets/${outletId}?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`GET feedback/dashboard/outlets failed: ${res.status}`);
  const json: ApiResponse = await res.json();
  return json.data;
}

/** Called when selectedOutlet === "all" (brand-wide) */
export async function fetchBrandFeedbackDashboard(
  { page = 1, limit = 5 }: FetchFeedbackParams = {}
): Promise<FeedbackDashboardData> {
  const res = await fetch(
    `/api/proxy/feedback/dashboard/brands?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`GET feedback/dashboard/brands failed: ${res.status}`);
  const json: ApiResponse = await res.json();
  return json.data;
}

/** Toggle feedback enabled — fetches current settings then PUTs the full body */
export async function toggleFeedbackEnabled(enabled: boolean): Promise<void> {
  // Fetch current settings so we can merge isFeedbackEnabled without
  // losing the rest of the fields (the API requires the full body).
  const getRes = await fetch("/api/proxy/feedback/settings", { method: "GET" });
  if (!getRes.ok) throw new Error(`GET feedback/settings failed: ${getRes.status}`);
  const { data } = await getRes.json();
  const s = data.settings;

  const putRes = await fetch("/api/proxy/feedback/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isFeedbackEnabled: enabled,
      categories: s.categories,
      isRewardEnabled: s.isRewardEnabled,
      rewardCoins: s.rewardCoins,
      feedbackTrigger: s.feedbackTrigger,
      delayHours: s.delayHours,
      notifyManager: s.notifyManager,
    }),
  });
  if (!putRes.ok) throw new Error(`PUT feedback/settings failed: ${putRes.status}`);
}