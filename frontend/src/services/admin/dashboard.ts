/**
 * services/admin/dashboard.ts
 */

export interface BusinessAtGlance {
  sales: number;
  orders: number;
}

export interface SalesOverviewItem {
  month: string;
  sales: number;
}

export interface WeeklyTrendItem {
  day: string;
  orders: number;
}

export interface DashboardData {
  businessAtGlance: BusinessAtGlance;
  averageOrderValue: { value: number };
  rewardsRedeemed: { coins: number };
  salesOverview: SalesOverviewItem[];
  weeklyTrend: WeeklyTrendItem[];
}

interface ApiResponse {
  data: DashboardData;
}

export async function fetchBrandDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/proxy/admin/dashboard");
  if (!res.ok) throw new Error(`GET admin/dashboard failed: ${res.status}`);
  const json: ApiResponse = await res.json();
  return json.data;
}

export async function fetchOutletDashboard(outletId: string): Promise<DashboardData> {
  const res = await fetch(`/api/proxy/admin/dashboard/${outletId}`);
  if (!res.ok) throw new Error(`GET admin/dashboard/${outletId} failed: ${res.status}`);
  const json: ApiResponse = await res.json();
  return json.data;
}