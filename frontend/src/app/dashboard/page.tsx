
"use client"

import { useEffect, useState } from "react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardGrid from "@/components/dashboard/DashboardGrid"
import {
  fetchDashboardStats,
  DashboardStats
} from "@/lib/mockDashboardApi"
import LoyaltyCard from "@/components/dashboard/LoyaltyCard"
import FeedbackCard from "@/components/dashboard/FeedbackCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function load() {
      const data = await fetchDashboardStats()
      setStats(data)
    }

    load()
  }, [])

  if (!stats) {
    return (
      <div className="p-10 min-h-screen space-y-6">

        {/* Top Grid Skeleton */}
        <div className="grid grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>

            <Skeleton className="h-65 rounded-2xl" />

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">

            <Skeleton className="h-65 rounded-2xl" />

            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>

          </div>

        </div>

        {/* Loyalty + Feedback Cards */}
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>

      </div>
    )
  }

  return (
    <div className="p-10  min-h-screen">


      <DashboardGrid stats={stats} />
      <LoyaltyCard
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
      />
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
