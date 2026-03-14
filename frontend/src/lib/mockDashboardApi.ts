export interface DashboardStats {
    totalSales: number
    rewardsRedeemed: number
    customerRepeatRate: number
    monthlyAvgSales: number
    avgFeedback: number
    redemptionRate: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 500))

    return {
        totalSales: 128450,
        rewardsRedeemed: 93,
        customerRepeatRate: 62,
        monthlyAvgSales: 84500,
        avgFeedback: 4.4,
        redemptionRate: 40
    }
}