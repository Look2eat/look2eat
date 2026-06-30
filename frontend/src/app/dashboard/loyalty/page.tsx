"use client"

import { useState, useEffect, useCallback } from "react"
import { useOutlet, ALL_OUTLETS } from "@/lib/auth/OutletContext"
import { useBrand } from "@/lib/auth/BrandContext"
import {
  getLoyaltyDashboard,
  type LoyaltyDashboardResponse,
} from "@/services/admin/loyalty"
import ReedemTable from "@/components/dashboard/ReedemTable"
import { LoyaltyCampaign } from "@/components/dashboard/loyalty/LoyaltyCampaign"
import { Skeleton } from "@/components/ui/skeleton"
import LoyaltyStats from "@/components/dashboard/loyalty/LoyaltyStats"
import CustomerRepeatRateCard from "@/components/dashboard/loyalty/CustomerRepeat"
import PageHeading from "@/components/dashboard/PageHeader"

export default function LoyaltyDashboardPage() {
  const { selectedOutlet } = useOutlet()
  const { brand } = useBrand()

  const [loyaltyData, setLoyaltyData] = useState<LoyaltyDashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAllOutlets = selectedOutlet === ALL_OUTLETS

  const loadDashboard = useCallback(async () => {
    if (!selectedOutlet) return
    if (isAllOutlets && !brand?.id) return // brand not resolved yet — wait

    setIsLoading(true)
    setError(null)
    try {
      const data = isAllOutlets
        ? await getLoyaltyDashboard({ type: "all", brandId: brand!.id })
        : await getLoyaltyDashboard({ type: "outlet", outletId: selectedOutlet })
      setLoyaltyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setLoyaltyData(null)
    } finally {
      setIsLoading(false)
    }
  }, [selectedOutlet, isAllOutlets, brand?.id])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (isLoading || !loyaltyData) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-[30%_70%] gap-6 mt-4">
          <Skeleton className="h-137 rounded-2xl" />
          <Skeleton className="h-137 rounded-2xl" />
        </div>
        {!isAllOutlets && (
          <div className="flex flex-col gap-3 mt-8">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-6 font-poppins">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  const { kpis, customerRepeatRate } = loyaltyData.data
  const { data: history, pagination } = loyaltyData.history

  return (
    <div className="px-6 py-6 font-poppins flex flex-col gap-6">
      <div>
        <PageHeading />
        <LoyaltyStats
          pointsRedeemed={kpis.pointsRedeemed}
          pointsIssued={kpis.pointsIssued}
          repeatCustomers={kpis.repeatCustomers}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-6 max-w-full pr-6">
        <CustomerRepeatRateCard
          data={{
            visit1: customerRepeatRate.visit1Time,
            visit2: customerRepeatRate.visit2Times,
            visit3to5: customerRepeatRate.visit3To5Times,
            visit6plus: customerRepeatRate.visit6PlusTimes,
          }}
        />
        <LoyaltyCampaign />
      </div>

      {/* History is outlet-specific — backend has no aggregate history
          across outlets (the all-outlets payload always returns an
          empty history array), so we hide the table entirely rather
          than show a misleading empty one. */}
      {!isAllOutlets && (
        <ReedemTable
          history={history}
          pagination={pagination}
          outletId={selectedOutlet}
        />
      )}
    </div>
  )
}