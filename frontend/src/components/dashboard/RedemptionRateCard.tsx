"use client";

import { AnimatedRadialChart } from "@/components/ui/animated-radial-chart";
import { DashboardStats } from "@/lib/mockDashboardApi";

interface Props {
    stats: DashboardStats;
}

export default function RedemptionRateCard({ stats }: Props) {
    return (
        <div className="rounded-2xl bg-muted/60 dark:bg-zinc-900 p-6 flex flex-col justify-between h-40 items-start">

            <h3 className="text-lg font-semibold text-black dark:text-white">
                Redemption Rate
            </h3>

            <div className="flex items-center justify-center flex-1">
                <AnimatedRadialChart
                    value={stats.redemptionRate}
                    size={150}
                    showLabels={false}
                    duration={2}


                />
            </div>

        </div>
    );
}