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

  if (error) {
    return (
      <div className="px-6 py-6 font-poppins">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  const kpis = loyaltyData?.data.kpis
  const customerRepeatRate = loyaltyData?.data.customerRepeatRate
  const history = loyaltyData?.history.data ?? []
  const pagination = loyaltyData?.history.pagination

  return (
    <div className="px-6 py-6 font-poppins flex flex-col gap-6">
      <div>
        <PageHeading />
        <LoyaltyStats
          isLoading={isLoading}
          pointsRedeemed={kpis?.pointsRedeemed ?? 0}
          pointsIssued={kpis?.pointsIssued ?? 0}
          repeatCustomers={kpis?.repeatCustomers ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-6 max-w-full pr-6">
        <CustomerRepeatRateCard
          isLoading={isLoading}
          data={{
            visit1: customerRepeatRate?.visit1Time ?? 0,
            visit2: customerRepeatRate?.visit2Times ?? 0,
            visit3to5: customerRepeatRate?.visit3To5Times ?? 0,
            visit6plus: customerRepeatRate?.visit6PlusTimes ?? 0,
          }}
        />
        <LoyaltyCampaign />
      </div>

      {/* History is outlet-specific — backend has no aggregate history
          across outlets, so we hide the table entirely for all-outlets.
          For a single outlet we wait for pagination to exist rather
          than rendering with an empty/undefined shape. */}
      {!isAllOutlets  && (
        <ReedemTable
    key={selectedOutlet}
    history={history}
    pagination={pagination}
    outletId={selectedOutlet}
    isInitialLoading={isLoading}
  />
      )}
    </div>
  )
}