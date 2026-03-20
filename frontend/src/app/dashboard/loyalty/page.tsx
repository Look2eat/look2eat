"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLoyaltyDashboardData } from "@/lib/mockDashboardApi"
import { LoyaltyDashboardData } from "@/types/rewards"
import LoyaltyCard from "@/components/dashboard/LoyaltyCard"
import { TopCustomersCard } from "@/components/dashboard/loyalty/topCustomersCard"
import { TopRewardsCard } from "@/components/dashboard/loyalty/topRewards"
import ReedemTable from "@/components/dashboard/ReedemTable"
import { LoyaltyCampaign } from "@/components/dashboard/loyalty/LoyaltyCampaign"



export default function LoyaltyDashboardPage() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyDashboardData | null>(null)

  useEffect(() => {
    async function loadLoyaltyDashboard() {
      const data = await fetchLoyaltyDashboardData()
      setLoyaltyData(data)
    }

    loadLoyaltyDashboard()
  }, [])

  if (!loyaltyData) {
    return <p className="p-6">Loading loyalty dashboard...</p>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <LoyaltyCard
        pointsRedeemed={5900}
        pointsEarned={1200}
        profileComplete={60}
        revenueGain={50000}
        redemptionRate={22.39}
        clickable={false}
        className="mt-0 mb-4"
      />

      <div className="grid grid-cols-1 xl:grid-cols-[30%_70%] gap-6 max-w-full p-6">

        <TopCustomersCard

          className="max-w-md"
          theme={"blue"}
          variant={"expanded"}
          title="Top 5 Customers by Rewards Redeemed"
          percentage={65}
          buttonText="Continue Setup"
          animationDuration={2000}
          staggerDelay={0.15}
          rounded="xl"
          showPercentage={false}
          enableAnimations={true}
          customer={loyaltyData.topCustomers}
        />
        <LoyaltyCampaign />
      </div>
      <div>
        <TopRewardsCard

          className="w-full h-full"
          theme={"blue"}
          variant={"expanded"}
          title="Most Redeemed Rewards"
          percentage={65}
          buttonText="Continue Setup"
          animationDuration={2000}
          staggerDelay={0.15}
          rounded="xl"
          showPercentage={false}
          enableAnimations={true}
          rewards={loyaltyData.rewardLeaderboard}
        />
      </div>
      <ReedemTable history={loyaltyData.history} />

    </div>
  )
}