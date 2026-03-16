
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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function load() {
      const data = await fetchDashboardStats()
      setStats(data)
    }

    load()
  }, [])

  if (!stats) return <p className="p-10">Loading dashboard...</p>

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
