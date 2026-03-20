import { LoyaltyDashboardData } from "@/types/rewards"

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

export async function fetchLoyaltyDashboardData(): Promise<LoyaltyDashboardData> {
    await new Promise(r => setTimeout(r, 500))

    return {
        kpis: {
            totalPointsEarned: 12480,
            totalPointsRedeemed: 5900,
            redemptionRate: 47.28,
            activeMembers: 322,
            revenueImpact: 50000,
        },
        topCustomers: [
            { id: "c1", name: "Aarav Singh", rewardsRedeemed: 18, totalPointsEarned: 2140 },
            { id: "c2", name: "Priya Sharma", rewardsRedeemed: 16, totalPointsEarned: 1980 },
            { id: "c3", name: "Rohan Verma", rewardsRedeemed: 14, totalPointsEarned: 1770 },
            { id: "c4", name: "Neha Gupta", rewardsRedeemed: 12, totalPointsEarned: 1655 },
            { id: "c5", name: "Kunal Mehta", rewardsRedeemed: 11, totalPointsEarned: 1490 },
        ],
        rewardLeaderboard: [
            { rewardId: "r1", rewardName: "Free Coffee", redeemedCount: 97 },
            { rewardId: "r2", rewardName: "10% Off Bill", redeemedCount: 83 },
            { rewardId: "r3", rewardName: "Free Dessert", redeemedCount: 62 },
            { rewardId: "r4", rewardName: "Buy 1 Get 1", redeemedCount: 48 },
            { rewardId: "r5", rewardName: "Free Starter", redeemedCount: 35 },
        ],
        history: [
            { id: "h1", dateTime: "2026-03-17 12:12", customerName: "Aarav Singh", action: "redeemed", pointsDelta: -250 },
            { id: "h2", dateTime: "2026-03-17 11:40", customerName: "Priya Sharma", action: "earned", pointsDelta: 90 },
            { id: "h3", dateTime: "2026-03-17 11:08", customerName: "Rohan Verma", action: "redeemed", pointsDelta: -180 },
            { id: "h4", dateTime: "2026-03-17 10:35", customerName: "Neha Gupta", action: "earned", pointsDelta: 70 },
            { id: "h5", dateTime: "2026-03-17 10:02", customerName: "Kunal Mehta", action: "redeemed", pointsDelta: -220 },
            { id: "h6", dateTime: "2026-03-17 09:41", customerName: "Ananya Rao", action: "earned", pointsDelta: 120 },
            { id: "h7", dateTime: "2026-03-17 09:16", customerName: "Manav Jain", action: "redeemed", pointsDelta: -150 },
            { id: "h8", dateTime: "2026-03-17 08:52", customerName: "Ishita Kapoor", action: "earned", pointsDelta: 85 },
        ],
    }
}