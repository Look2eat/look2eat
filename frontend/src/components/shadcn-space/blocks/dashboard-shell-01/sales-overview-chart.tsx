"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const chartData = [
  { month: "Jan", sales: 12 },
  { month: "Feb", sales: 18 },
  { month: "Mar", sales: 15 },
  { month: "Apr", sales: 22 },
  { month: "May", sales: 28 },
  { month: "Jun", sales: 24 },
  { month: "Jul", sales: 35 },
  { month: "Aug", sales: 31 },
  { month: "Sep", sales: 20 },
  { month: "Oct", sales: 38 },
  { month: "Nov", sales: 42 },
  { month: "Dec", sales: 48 },
];

const Y_TICKS = [0, 10, 20, 30, 40, 50];
const MAX_VAL = 50;

export default function SalesOverviewChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string | null>(null);

  const handleEnter = (i: number) => {
    setHoveredIdx(i);
    setDisplayValue(chartData[i].sales);
    setDisplayMonth(chartData[i].month);
  };

  const handleLeave = () => {
    setHoveredIdx(null);
    setTimeout(() => {
      setDisplayValue(null);
      setDisplayMonth(null);
    }, 150);
  };

  const isHovered = (i: number) => hoveredIdx === i;
  const isNeighbor = (i: number) =>
    hoveredIdx !== null && (i === hoveredIdx - 1 || i === hoveredIdx + 1);
  const isAnyHovered = hoveredIdx !== null;
  const isDimmed = (i: number) =>
    isAnyHovered && !isHovered(i) && !isNeighbor(i);

  const getBarClass = (i: number) => {
    if (isHovered(i)) return "bg-foreground";
    if (isNeighbor(i)) return "bg-foreground/30";
    if (isDimmed(i)) return "bg-foreground/[0.07]";
    return "bg-foreground/15";
  };

  return (
    <Card className="w-full py-6 gap-6 bg-white dark:bg-[#121214]  rounded-2xl ">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-start items-start gap-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-semibold text-card-foreground">₹3.86 Cr</h3>
            <Badge className="bg-teal-400/25 text-foreground font-normal border-0 shadow-none">
              +18%
            </Badge>
            <span className="text-xs text-muted-foreground">than last year</span>
          </div>
        </div>

        {/* Live hover value */}
        <div className="flex flex-col items-end gap-0.5 min-w-[80px]">
          <span
            className={cn(
              "text-xs text-muted-foreground transition-opacity duration-200",
              hoveredIdx !== null ? "opacity-100" : "opacity-0"
            )}
          >
            {displayMonth} 2024
          </span>
          <span
            className={cn(
              "text-xl font-bold tabular-nums text-foreground transition-opacity duration-200",
              hoveredIdx !== null && displayValue !== null ? "opacity-100" : "opacity-0"
            )}
          >
            {displayValue !== null ? `₹${displayValue}L` : ""}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex gap-0 h-[280px]">

          {/* Y Axis */}
          <div className="flex flex-col justify-between pb-7 pr-3 w-9 shrink-0">
            {[...Y_TICKS].reverse().map((t) => (
              <span
                key={t}
                className="text-[10px] text-muted-foreground/40 text-right leading-none"
              >
                {t === 0 ? "0" : `${t}L`}
              </span>
            ))}
          </div>

          {/* Chart body */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Bars */}
            <div
              className="flex-1 flex items-end gap-1.5 relative"
              onMouseLeave={handleLeave}
            >
              {chartData.map((d, i) => {
                const heightPct = (d.sales / MAX_VAL) * 100;
                return (
                  <div
                    key={d.month}
                    className="relative flex-1 flex flex-col items-center justify-end h-full z-10"
                    onMouseEnter={() => handleEnter(i)}
                  >
                    {/* Tooltip */}
                    <div
                      className={cn(
                        "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-foreground text-background text-xs font-bold whitespace-nowrap transition-all duration-150 pointer-events-none",
                        isHovered(i)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-1"
                      )}
                    >
                      ₹{d.sales}L
                    </div>

                    {/* Bar */}
                    <div
                      className={cn(
                        "w-[80%] rounded-full transition-all duration-300 ease-out origin-bottom",
                        getBarClass(i)
                      )}
                      style={{
                        height: `${heightPct}%`,
                        transform: isHovered(i)
                          ? "scaleX(1.2) scaleY(1.02)"
                          : isNeighbor(i)
                            ? "scaleX(1.06)"
                            : "scaleX(1)",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X Labels */}
            <div className="flex gap-1.5 h-7 items-end pb-0.5">
              {chartData.map((d, i) => (
                <div
                  key={d.month}
                  className={cn(
                    "flex-1 text-center text-xs transition-colors duration-200 ",
                    isHovered(i)
                      ? "text-foreground font-semibold"
                      : isDimmed(i)
                        ? "text-muted-foreground/60"
                        : "text-muted-foreground/60"
                  )}
                >
                  {d.month}
                </div>
              ))}
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}