"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/lib/auth/DashboardContext";

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function ChartSkeleton() {
  const heights = [40, 60, 30, 80, 55, 35, 65];
  return (
    <div className="flex items-end gap-2 h-full">
      {heights.map((h, i) => (
        <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full">
          <div
            className="w-full rounded-full bg-muted animate-pulse"
            style={{ height: `${h}%` }}
          />
          <span className="inline-block mt-2 h-2.5 w-3 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function MiniChart() {
  const { data, loading } = useDashboard();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const chartData = (data?.weeklyTrend ?? []).map((d) => ({
    label: d.day,
    value: d.orders,
  }));

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  useEffect(() => {
    if (hoveredIndex !== null) setDisplayValue(chartData[hoveredIndex]?.value ?? null);
  }, [hoveredIndex]);

  const handleContainerLeave = () => {
    setIsHovering(false);
    setHoveredIndex(null);
    setTimeout(() => setDisplayValue(null), 150);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleContainerLeave}
      className="group relative w-full h-full p-6 rounded-2xl bg-white dark:bg-[#121214] flex flex-col gap-4 font-poppins"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xl font-semibold text-card-foreground">Weekly Trend</span>
        <div className="relative h-7 flex items-center">
          <span
            className={cn(
              "text-lg font-semibold tabular-nums transition-all duration-300 ease-out",
              isHovering && displayValue !== null
                ? "opacity-100 text-foreground"
                : "opacity-50 text-muted-foreground"
            )}
          >
            {displayValue !== null ? displayValue : ""}
            <span
              className={cn(
                "text-xs font-normal text-muted-foreground ml-0.5 transition-opacity duration-300",
                displayValue !== null ? "opacity-100" : "opacity-0"
              )}
            >
              orders
            </span>
          </span>
        </div>
      </div>

      {/* Chart or skeleton */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <div className="flex items-end gap-2 h-full">
          {chartData.map((item, index) => {
            const heightPx = (item.value / maxValue) * 280;
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isNeighbor =
              hoveredIndex !== null &&
              (index === hoveredIndex - 1 || index === hoveredIndex + 1);

            return (
              <div
                key={item.label}
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
                    height: `${Math.max(heightPx, 4)}px`,
                    transform: isHovered
                      ? "scaleX(1.15) scaleY(1.02)"
                      : isNeighbor
                        ? "scaleX(1.05)"
                        : "scaleX(1)",
                  }}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium mt-2 transition-all duration-300",
                    isHovered ? "text-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {item.label.charAt(0)}
                </span>
                <div
                  className={cn(
                    "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium transition-all duration-200 whitespace-nowrap",
                    isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  )}
                >
                  {item.value} orders
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}