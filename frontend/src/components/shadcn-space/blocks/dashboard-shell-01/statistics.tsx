"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, LucideIcon, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDashboard } from "@/lib/auth/DashboardContext";

// ---------------------------------------------------------------------------
// Skeleton — inline, width-controlled so only the number slot pulses
// ---------------------------------------------------------------------------
function NumSkeleton({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-md bg-muted animate-pulse align-middle ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StatItem = {
  title: string;
  value: React.ReactNode;
  badge?: string;
  isPositive?: boolean;
  icon: LucideIcon;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const StatisticsBlock = () => {
  const { data, loading } = useDashboard();

  const fmt = (n: number) =>
    n >= 1_00_000
      ? `₹${(n / 1_00_000).toFixed(2)} L`
      : n >= 1000
        ? `₹${(n / 1000).toFixed(1)}K`
        : `₹${n}`;

  const num = (v: React.ReactNode) =>
    loading ? <NumSkeleton className="h-9 w-24" /> : v;

  const metrics = [
    {
      label: "Sales",
      value: num(data ? fmt(data.businessAtGlance.sales) : "—"),
      isPositive: true,
    },
    {
      label: "Orders",
      value: num(data ? String(data.businessAtGlance.orders) : "—"),
      isPositive: true,
    },
  ];

  const secondaryStats: StatItem[] = [
    {
      title: "Average Order Value",
      value: num(data ? fmt(data.averageOrderValue.value) : "—"),
      icon: CalendarDays,
      isPositive: true,
    },
    {
      title: "Rewards Redeemed",
      value: num(data ? String(data.rewardsRedeemed.coins) : "—"),
      icon: ShoppingBag,
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Main card */}
      <div className="col-span-12 xl:col-span-6 h-full">
        <Card className="p-0 ring-0 rounded-2xl relative h-full">
          <CardContent className="p-0">
            <div className="ps-6 py-4 flex flex-col gap-9 justify-between">
              <div>
                <p className="text-xl font-semibold text-card-foreground">
                  Your Business at a Glance
                </p>
                <p className="text-xs font-normal text-muted-foreground">Today&apos;s stats</p>
              </div>
              <div className="flex items-center gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center gap-1 min-h-10">
                        <p className="text-3xl font-semibold text-card-foreground">
                          {metric.value}
                        </p>
                      </div>
                    </div>
                    {index < metrics.length - 1 && (
                      <div className="w-px h-12 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Image
              src="https://images.shadcnspace.com/assets/backgrounds/stats-01.webp"
              alt="stats"
              width={211}
              height={168}
              className="absolute bottom-0 right-0 hidden sm:block rounded-2xl"
            />
          </CardContent>
        </Card>
      </div>

      {/* Secondary stat cards */}
      {secondaryStats.map((stat, index) => (
        <div key={index} className="col-span-12 sm:col-span-6 xl:col-span-3 min-h-36">
          <Card className="py-6 ring-0 rounded-2xl min-h-40">
            <CardContent className="px-6 flex items-start justify-between min-h-36">
              <div className="flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-10">
                  <p className="text-xl font-semibold text-card-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 min-h-10">
                    <p className="text-3xl font-semibold text-card-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-full outline">
                <stat.icon size={16} />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default StatisticsBlock;