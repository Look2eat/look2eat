"use client"

import { useState, useEffect, useCallback } from "react"
import LoyaltyStats from "@/components/dashboard/loyalty/LoyaltyStats"
import { Skeleton } from "@/components/ui/skeleton"
import { useOutlet, ALL_OUTLETS } from "@/lib/auth/OutletContext"
import { useBrand } from "@/lib/auth/BrandContext"
import { getLoyaltyDashboard } from "@/services/admin/loyalty"

function LoyaltyCard() {
    const { selectedOutlet } = useOutlet()
    const { brand } = useBrand()

    const [kpis, setKpis] = useState<{
        pointsRedeemed: number
        pointsIssued: number
        repeatCustomers: number
    } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAllOutlets = selectedOutlet === ALL_OUTLETS

    const loadKpis = useCallback(async () => {
        if (!selectedOutlet) return
        if (isAllOutlets && !brand?.id) return // brand not resolved yet — wait

        setIsLoading(true)
        try {
            const res = isAllOutlets
                ? await getLoyaltyDashboard({ type: "all", brandId: brand!.id })
                : await getLoyaltyDashboard({ type: "outlet", outletId: selectedOutlet })
            setKpis(res.data.kpis)
        } catch {
            // Dashboard preview card — fail soft, same reasoning as
            // BrandContext: a failed fetch here shouldn't block the rest
            // of the dashboard. LoyaltyStats just won't render until the
            // next successful load.
            setKpis(null)
        } finally {
            setIsLoading(false)
        }
    }, [selectedOutlet, isAllOutlets, brand?.id])

    useEffect(() => {
        loadKpis()
    }, [loadKpis])

    return (
        <div className="w-full overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-white dark:bg-[#121214] h-60  font-poppins">
            {isLoading || !kpis ? (
                <Skeleton className="h-full w-full rounded-xl" />
            ) : (
                <LoyaltyStats
                    classname='bg-background dark:bg-[#1E1F27]'
                    pointsRedeemed={kpis.pointsRedeemed}
                    pointsIssued={kpis.pointsIssued}
                    repeatCustomers={kpis.repeatCustomers}
                />
            )}
        </div>
    )
}

export default LoyaltyCard