
"use client"

import { useEffect, useState } from "react"

// import {
//   fetchDashboardStats,
//   DashboardStats
// } from "@/lib/mockDashboardApi"
import { getDashboardKpis, DashboardKpis } from "@/services/api"

import { Skeleton } from "@/components/ui/skeleton"
import { getBrandIdFromToken } from "@/lib/auth"
import StatisticsBlock from "@/components/shadcn-space/blocks/dashboard-shell-01/statistics"
import SalesOverviewChart from "@/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart"

import PreviewTabs from "@/components/shadcn-space/blocks/dashboard-shell-01/tabs"
import { MiniChart } from "@/components/ui/mini-chart"


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardKpis | null>(null)
  const brandId = getBrandIdFromToken() // pull from context/localStorage/store

  useEffect(() => {
    async function load() {
      const data = await getDashboardKpis(brandId)
      console.log(data.data)
      setStats(data)
    }
    load()
  }, [brandId])

  if (!stats) {
    return (
      <div className="p-4 md:p-10 min-h-screen space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-86 rounded-2xl" />
          </div>
        </div>
      </div>
    )

  }

  return (

    <div className=" min-h-screen">
      {/* <DashboardGrid stats={stats} /> */}
      <div className="grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        <div className="col-span-12">
          <StatisticsBlock />
        </div>
        <div className="xl:col-span-8 col-span-12">
          <SalesOverviewChart />
        </div>
        <div className="xl:col-span-4 col-span-12">
          <MiniChart />
        </div>
        <div className="col-span-12">
          <div className="flex items-start justify-start mb-4">
            <PreviewTabs />
          </div>


        </div>
      </div>

      {/* <LoyaltyCard
        pointsRedeemed={5900}
        pointsEarned={1200}
        profileComplete={60}
        revenueGain={50000}
        redemptionRate={22.39}
      />

      <FeedbackCard
        totalFeedbacks={2}
        averageRating={1.5}
        positiveFeedback={80}
        negativeFeedback={10}
      /> */}
    </div>
  )
}

// export default function Page() {
//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">

//             <div className="bg-muted/50 aspect-video rounded-xl" />

//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//           </div>
//           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//         </div> 
//   )
// }
