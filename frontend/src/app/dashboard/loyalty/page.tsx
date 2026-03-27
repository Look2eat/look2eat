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
import { Skeleton } from "@/components/ui/skeleton"


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
    return (
      <div className="flex flex-col gap-6 p-6">

        {/* Loyalty Card */}
        <Skeleton className="h-52 rounded-2xl" />

        {/* Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-[30%_70%] gap-6 mt-4">

          {/* Top Customers */}
          <Skeleton className="h-137 rounded-2xl" />

          {/* Campaign / Right Panel */}
          <Skeleton className="h-137 rounded-2xl" />

        </div>

        {/* Optional Rewards Section */}
        {/* <Skeleton className="h-[250px] rounded-2xl" /> */}

        {/* Table Skeleton */}
        <div className="flex flex-col gap-3 mt-8">
          <Skeleton className="h-10 w-1/3 rounded-lg" />

          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>

      </div>
    )
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

      <div className="grid grid-cols-1 xl:grid-cols-[30%_70%] gap-6 max-w-full pr-6">

        <TopCustomersCard

          className="max-w-md"
          theme={"blue"}
          variant={"expanded"}
          title="Top 5 Customers by Rewards Redeemed"
          percentage={65}
          buttonText="Continue Setup"
          animationDuration={2500}
          staggerDelay={0.25}
          rounded="xl"
          showPercentage={false}
          enableAnimations={true}
          customer={loyaltyData.topCustomers}
        />
        <LoyaltyCampaign />
      </div>
      <div>
        {/* <TopRewardsCard

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
        /> */}
      </div>
      <ReedemTable history={loyaltyData.history} />

    </div>
  )
}