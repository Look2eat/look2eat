"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/lib/auth/DashboardContext";

const Y_TICKS = [0, 10, 20, 30, 40, 50];

// ---------------------------------------------------------------------------
// Bar chart skeleton — mimics the real bar layout while loading
// ---------------------------------------------------------------------------
function ChartSkeleton() {
  return (
    <div className="flex gap-0 h-[280px]">
      {/* Y axis placeholder */}
      <div className="flex flex-col justify-between pb-7 pr-3 w-9 shrink-0">
        {[...Y_TICKS].reverse().map((t) => (
          <span
            key={t}
            className="inline-block h-2.5 w-6 rounded bg-muted animate-pulse"
          />
        ))}
      </div>
      {/* Bars */}
      <div className="flex-1 flex items-end gap-1.5 pb-7">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className="w-[80%] rounded-full bg-muted animate-pulse"
              style={{ height: `${25 + Math.sin(i) * 15}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SalesOverviewChart() {
  const { data, loading } = useDashboard();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string | null>(null);

  const chartData = data?.salesOverview ?? [];
  const maxVal = Math.max(...chartData.map((d) => d.sales), 1);

  const handleEnter = (i: number) => {
    setHoveredIdx(i);
    setDisplayValue(chartData[i].sales);
    setDisplayMonth(chartData[i].month);
  };

  const handleLeave = () => {
    setHoveredIdx(null);
    setTimeout(() => { setDisplayValue(null); setDisplayMonth(null); }, 150);
  };

  const isHovered = (i: number) => hoveredIdx === i;
  const isNeighbor = (i: number) =>
    hoveredIdx !== null && (i === hoveredIdx - 1 || i === hoveredIdx + 1);
  const isAnyHovered = hoveredIdx !== null;
  const isDimmed = (i: number) => isAnyHovered && !isHovered(i) && !isNeighbor(i);

  const getBarClass = (i: number) => {
    if (isHovered(i)) return "bg-foreground";
    if (isNeighbor(i)) return "bg-foreground/30";
    if (isDimmed(i)) return "bg-foreground/[0.07]";
    return "bg-foreground/15";
  };

  // Format sales value for header display
  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);
  const fmtTotal =
    totalSales >= 10_00_000
      ? `₹${(totalSales / 10_00_000).toFixed(2)} Cr`
      : totalSales >= 1_00_000
        ? `₹${(totalSales / 1_00_000).toFixed(2)} L`
        : `₹${totalSales.toLocaleString("en-IN")}`;

  return (
    <Card className="w-full py-6 gap-6 bg-white dark:bg-[#121214] rounded-2xl">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-start items-start gap-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-semibold">Sales Overview</CardTitle>
          <div className="flex items-center gap-2 min-h-10">
            {loading ? (
              <span className="inline-block h-9 w-32 rounded-md bg-muted animate-pulse" />
            ) : (
              <>
                <h3 className="text-3xl font-semibold text-card-foreground">{fmtTotal}</h3>
                <Badge className="bg-teal-400/25 text-foreground font-normal border-0 shadow-none">
                  Live
                </Badge>
                <span className="text-xs text-muted-foreground">all time</span>
              </>
            )}
          </div>
        </div>

        {/* Hover value */}
        <div className="flex flex-col items-end gap-0.5 min-w-[80px]">
          <span
            className={cn(
              "text-xs text-muted-foreground transition-opacity duration-200",
              hoveredIdx !== null ? "opacity-100" : "opacity-0"
            )}
          >
            {displayMonth}
          </span>
          <span
            className={cn(
              "text-xl font-bold tabular-nums text-foreground transition-opacity duration-200",
              hoveredIdx !== null && displayValue !== null ? "opacity-100" : "opacity-0"
            )}
          >
            {displayValue !== null ? `₹${displayValue.toLocaleString("en-IN")}` : ""}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="flex gap-0 h-[280px]">
            {/* Y Axis */}
            <div className="flex flex-col justify-between pb-7 pr-3 w-9 shrink-0">
              {[...Array(6)].reverse().map((_, i) => {
                const tick = Math.round((maxVal / 5) * (5 - i));
                return (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground/40 text-right leading-none"
                  >
                    {tick === 0 ? "0" : tick >= 1000 ? `${(tick / 1000).toFixed(0)}K` : tick}
                  </span>
                );
              })}
            </div>

            {/* Chart body */}
            <div className="flex-1 flex flex-col min-w-0">
              <div
                className="flex-1 flex items-end gap-1.5 relative"
                onMouseLeave={handleLeave}
              >
                {chartData.map((d, i) => {
                  const heightPct = (d.sales / maxVal) * 100;
                  return (
                    <div
                      key={d.month}
                      className="relative flex-1 flex flex-col items-center justify-end h-full z-10"
                      onMouseEnter={() => handleEnter(i)}
                    >
                      <div
                        className={cn(
                          "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-foreground text-background text-xs font-bold whitespace-nowrap transition-all duration-150 pointer-events-none",
                          isHovered(i)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1"
                        )}
                      >
                        ₹{d.sales.toLocaleString("en-IN")}
                      </div>
                      <div
                        className={cn(
                          "w-[80%] rounded-full transition-all duration-300 ease-out origin-bottom",
                          getBarClass(i)
                        )}
                        style={{
                          height: `${Math.max(heightPct, 2)}%`,
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
                      "flex-1 text-center text-xs transition-colors duration-200",
                      isHovered(i)
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {d.month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}