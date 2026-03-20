export type Reward = {
    id: string;
    pointsRequired: number;
    description: string;
}

export interface LoyaltyKpis {
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    redemptionRate: number;
    activeMembers: number;
    revenueImpact: number;
}

export interface TopCustomerByRedemptions {
    id: string;
    name: string;
    rewardsRedeemed: number;
    totalPointsEarned: number;
}

export interface RewardLeaderboardItem {
    rewardId: string;
    rewardName: string;
    redeemedCount: number;
}

export interface RewardHistoryRow {
    id: string;
    dateTime: string;
    customerName: string;
    action: "earned" | "redeemed";
    pointsDelta: number;
}

export interface LoyaltyDashboardData {
    kpis: LoyaltyKpis;
    topCustomers: TopCustomerByRedemptions[];
    rewardLeaderboard: RewardLeaderboardItem[];
    history: RewardHistoryRow[];
}