"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { MonthlySale } from "@/lib/mockSalesApi"

interface Props {
    sales: MonthlySale[]
}

export function MonthlyAvgSales({ sales }: Props) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [displayValue, setDisplayValue] = useState<number | null>(null)
    const [displayMonth, setDisplayMonth] = useState<string | null>(null)
    const [isHovering, setIsHovering] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (hoveredIndex !== null && sales[hoveredIndex]) {
            setDisplayValue(sales[hoveredIndex].revenue)
            setDisplayMonth(sales[hoveredIndex].month)
        }
    }, [hoveredIndex, sales])

    const handleContainerEnter = () => setIsHovering(true)

    const handleContainerLeave = () => {
        setIsHovering(false)
        setHoveredIndex(null)

        setTimeout(() => {
            setDisplayValue(null)
            setDisplayMonth(null)
        }, 150)
    }

    const revenues = sales.map((s) => s.revenue)
    const maxValue = Math.max(...revenues)
    const minValue = Math.min(...revenues)

    const BASE_HEIGHT = 60
    const MAX_BAR_HEIGHT = 120

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleContainerEnter}
            onMouseLeave={handleContainerLeave}
            className="h-65 group relative w-full p-6 rounded-2xl bg-muted/60 border border-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:bg-foreground/[0.04] hover:border-foreground/[0.1] flex flex-col gap-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-md font-bold tracking-wide uppercase">
                    Monthly Sales
                </span>

                <div className="relative h-7 flex items-center">
                    <span
                        className={cn(
                            "text-lg font-semibold tabular-nums transition-all duration-300 ease-out",
                            isHovering && displayValue !== null
                                ? "opacity-100 text-foreground"
                                : "opacity-50 text-muted-foreground"
                        )}
                    >
                        {displayValue !== null && (
                            <span className="font-bold">
                                {displayMonth} - ₹{displayValue.toLocaleString()}
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-2 h-45">
                {sales.map((item, index) => {
                    const normalized =
                        (item.revenue - minValue) / (maxValue - minValue || 1)

                    const heightPx =
                        BASE_HEIGHT + normalized * (MAX_BAR_HEIGHT - BASE_HEIGHT)

                    const isHovered = hoveredIndex === index
                    const isAnyHovered = hoveredIndex !== null
                    const isNeighbor =
                        hoveredIndex !== null &&
                        (index === hoveredIndex - 1 || index === hoveredIndex + 1)

                    return (
                        <div
                            key={item.month}
                            className="relative flex-1 flex flex-col items-center justify-end h-full"
                            onMouseEnter={() => setHoveredIndex(index)}
                        >
                            <div
                                className={cn(
                                    "w-full rounded-full cursor-pointer transition-all duration-300 ease-out origin-bottom",
                                    isHovered
                                        ? "bg-foreground"
                                        : isNeighbor
                                            ? "bg-foreground/30"
                                            : isAnyHovered
                                                ? "bg-foreground/10"
                                                : "bg-foreground/20 group-hover:bg-foreground/25"
                                )}
                                style={{
                                    height: `${heightPx}px`,
                                    transform: isHovered
                                        ? "scaleX(1.15) scaleY(1.02)"
                                        : isNeighbor
                                            ? "scaleX(1.05)"
                                            : "scaleX(1)"
                                }}
                            />

                            <span
                                className={cn(
                                    "text-[10px] font-medium mt-2 transition-all duration-300",
                                    isHovered
                                        ? "text-foreground"
                                        : "text-muted-foreground/60"
                                )}
                            >
                                {item.month}
                            </span>

                            <div
                                className={cn(
                                    "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium transition-all duration-200 whitespace-nowrap",
                                    isHovered
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-1 pointer-events-none"
                                )}
                            >
                                ₹{item.revenue.toLocaleString()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}