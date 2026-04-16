import { DashboardKpis } from "@/services/api"
import StatCard from "./StatCard"
import CustomerRepeatRateCard from "./loyalty/CustomerRepeat"

interface Props {
    stats: DashboardKpis
}

export default function DashboardGrid({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <StatCard
                        title="Total Sales"
                        value={`₹${stats.data.kpis.totalSales.toLocaleString('en-IN')}`}
                        className="h-40"
                    />
                    <StatCard
                        title="Rewards Redeemed"
                        value={stats.data.kpis.totalRewardRedeemed}
                        className="h-40"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <StatCard
                        title="Redemption Rate"
                        value={`${stats.data.kpis.redemptionRate.toFixed(2)} %`}
                        className="h-40"
                    />
                    <StatCard
                        title="Points Issued"
                        value={stats.data.kpis.totalPointsIssued.toLocaleString('en-IN')}
                        className="h-40"
                    />
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
                <CustomerRepeatRateCard
                    data={{
                        visit1: stats.data.graph.customerReturnRate.visit1Time,
                        visit2: stats.data.graph.customerReturnRate.visit2Times,
                        visit3to5: stats.data.graph.customerReturnRate.visit3To5Times,
                        visit6plus: stats.data.graph.customerReturnRate.visit6PlusTimes,
                    }}
                />
            </div>

        </div>
    )
}
// "use client"

// import { useEffect, useState } from "react"
// import { fetchMonthlySales, MonthlySale, mockRepeatRate, RepeatRateData } from "@/lib/mockSalesApi"

// import { MonthlyAvgSales } from "./MonthlyAvgSales"
// import RedemptionRateCard from "./RedemptionRateCard"
// import StatCard from "./StatCard"
// import { DashboardStats } from "@/lib/mockDashboardApi"

// import CustomerRepeatRateCard from "./loyalty/CustomerRepeat"

// interface Props {
//     stats: DashboardStats
// }

// export default function DashboardGrid({ stats }: Props) {

//     const [sales, setSales] = useState<MonthlySale[]>([])
//     const [repeat, setRepeat] = useState<RepeatRateData>({
//         visit1: 0,
//         visit2: 0,
//         visit3to5: 0,
//         visit6plus: 0,
//     })

//     useEffect(() => {
//         fetchMonthlySales().then((res) => {
//             setSales(res.monthlySales)
//         })
//         mockRepeatRate().then((res) => {
//             setRepeat(res)
//         })

//     }, [])

//     return (
//         <div className="grid grid-cols-2 gap-6">

//             {/* LEFT COLUMN */}
//             <div className="flex flex-col gap-6">

//                 <div className="grid grid-cols-2 gap-6">
//                     <StatCard
//                         title="Total Sales"
//                         value={`₹${stats.totalSales.toLocaleString()}`}
//                         className="h-40"
//                     />

//                     <StatCard
//                         title="Rewards Redeemed"
//                         value={stats.rewardsRedeemed}
//                         className="h-40"
//                     />
//                 </div>
//                 <div className="grid grid-cols-2 gap-6">

//                     <StatCard
//                         title="Avg Feedback"
//                         value={`${stats.avgFeedback} ⭐`}
//                         className="h-40"
//                     />

//                     <StatCard
//                         title="Redemption Rate"
//                         value={`${stats.redemptionRate}%`}
//                         className="h-40"
//                     />

//                 </div>
//                 {/* <MonthlyAvgSales sales={sales} /> */}

//             </div>


//             {/* RIGHT COLUMN */}
//             <div className="flex flex-col gap-6">

//                 {/* <StatCard
//                     title="Customer Repeat Rate"
//                     value={`${stats.customerRepeatRate}%`}
//                     className="h-65"
//                 /> */}
//                 <CustomerRepeatRateCard
//                     data={repeat}
//                 />

//                 {/* <div className="grid grid-cols-2 gap-6">

//                     <StatCard
//                         title="Avg Feedback"
//                         value={`${stats.avgFeedback} ⭐`}
//                         className="h-40"
//                     />

//                     <StatCard
//                         title="Redemption Rate"
//                         value={`${stats.redemptionRate}%`}
//                         className="h-40"
//                     />

//                 </div> */}

//             </div>

//         </div>
//     )
// }