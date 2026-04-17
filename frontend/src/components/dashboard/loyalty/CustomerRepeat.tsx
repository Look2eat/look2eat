"use client"

import { cn } from "@/lib/utils"

interface Props {
    data: {
        visit1: number
        visit2: number
        visit3to5: number
        visit6plus: number
    }
}

export default function CustomerRepeatRateCard({ data }: Props) {

    const rows = [
        { label: "Visit 1 time", value: data.visit1 },
        { label: "Visit 2 times", value: data.visit2 },
        { label: "Visit 3 to 5 times", value: data.visit3to5 },
        { label: "Visit 6+ times", value: data.visit6plus },
    ]

    const total =
        data.visit1 +
        data.visit2 +
        data.visit3to5 +
        data.visit6plus

    return (
        <div className="p-4 md:p-6 rounded-2xl bg-muted/60 border border-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:bg-foreground/[0.04] hover:border-foreground/[0.1] flex flex-col gap-6 md:gap-10">

            <h3 className="text-sm md:text-base font-bold tracking-wide uppercase">
                Customer Repeat Rate
            </h3>

            <div className="flex flex-col gap-6 md:gap-10">
                {rows.map((row) => {
                    const percent =
                        total === 0
                            ? 0
                            : Math.round((row.value / total) * 100)

                    return (
                        <div
                            key={row.label}
                            className="grid grid-cols-[90px_1fr_60px] md:grid-cols-[160px_1fr_80px] items-center gap-2 md:gap-4"
                        >
                            {/* Label */}
                            <span className="text-[10px] md:text-sm font-medium leading-tight">
                                {row.label}
                            </span>

                            {/* Bar — takes up more space on mobile since label/value cols are smaller */}
                            <div className="relative w-full h-4 md:h-6 bg-foreground/10 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700 ease-out",
                                        percent > 0 ? "bg-blue-600" : "bg-foreground/10"
                                    )}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            {/* Percent */}
                            <span className="text-[10px] md:text-sm font-semibold text-right">
                                {percent}%
                                <span className="hidden md:inline"> | {row.value}</span>
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}