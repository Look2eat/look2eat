"use client"

import { Gift } from "lucide-react"
import { cn } from "@/lib/utils";

interface Props {

  revenueGain: number
  redemptionRate: number
  profileComplete: number
  pointsEarned?: number
  pointsRedeemed: number
  clickable?: boolean
  className?: string
}

export default function LoyaltyCard({
  pointsRedeemed,
  revenueGain,
  pointsEarned,
  profileComplete, clickable = true, className
}: Props) {
  return (
    <div
      className={cn(
        "p-8 rounded-2xl dark:bg-[#271909] bg-[#fbeede] flex flex-col gap-10 my-8 mt-10",
        className
      )}
    >

      {/* Header */}
      <div className="flex items-center gap-3 text-2xl font-semibold">
        <Gift size={28} />
        Loyalty
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-10">

        <div>
          <p className="text-4xl font-bold">{pointsRedeemed}</p>
          <p className=" mt-2 opacity-80">Points Redeemed</p>
        </div>

        <div>
          <p className="text-4xl font-bold">{pointsEarned}</p>
          <p className=" mt-2 opacity-80">Points Issued</p>
        </div>

        <div>
          <p className="text-4xl font-bold">₹{revenueGain}</p>
          <p className="mt-2 opacity-80">Est. Revenue Gain</p>
        </div>

        <div>
          <p className="text-4xl font-bold">{profileComplete}%</p>
          <p className=" mt-2 opacity-80">Profile Completion Rate</p>
        </div>

      </div>

      {/* Footer */}
      {clickable &&
        <button className="underline text-lg font-medium w-fit hover:opacity-70" >
          View More
        </button>}

    </div>
  )
}
