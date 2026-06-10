import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CalendarDays,
  LucideIcon,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type DashboardMetric = {
  label: string;
  value: string;
  percentage: string;
  isPositive?: boolean;
};

type MainDashboardData = {
  title: string;
  description: string;
  metrics: DashboardMetric[];
};

type StatItem = {
  title: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
  isPositive?: boolean;
};

type StatisticsBlockProps = {
  mainDashboard?: MainDashboardData;
  secondaryStats?: StatItem[];
};

const mainDashboardData: MainDashboardData = {
  title: "Your Business at a Glance",
  description: "Today's stats",
  metrics: [
    {
      label: "Sales",
      value: "₹27,850",
      percentage: "+18%",
      isPositive: true,
    },
    {
      label: "Orders",
      value: "85",
      percentage: "-5%",
      isPositive: false,
    },
  ],
};

const secondaryStatsData: StatItem[] = [
  {
    title: "Average Order Value",
    value: "₹328",
    percentage: "+18%",
    icon: CalendarDays,
    isPositive: true,
  },
  {
    title: "Rewards Redeemed",
    value: "230",
    percentage: "+18%",
    icon: ShoppingBag,
    isPositive: true,
  },
];

const StatisticsBlock = ({
  mainDashboard = mainDashboardData,
  secondaryStats = secondaryStatsData,
}: StatisticsBlockProps) => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 xl:col-span-6 h-full">
        <Card className="p-0 ring-0  rounded-2xl relative h-full">
          <CardContent className="p-0">
            <div className="ps-6 py-4 flex flex-col gap-9 justify-between">
              <div>
                <p className="text-xl font-semibold text-card-foreground">
                  {mainDashboard.title}
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  {mainDashboard.description}
                </p>
              </div>
              <div className="flex items-center gap-6">
                {mainDashboard.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-3xl font-semibold text-card-foreground">
                          {metric.value}
                        </p>
                        <Badge
                          className={cn(
                            "font-normal text-foreground",
                            metric.isPositive
                              ? "bg-teal-400/25"
                              : "bg-red-500/25",
                          )}
                        >
                          {metric.percentage}
                        </Badge>
                      </div>
                    </div>

                    {index < mainDashboard.metrics.length - 1 && (
                      <div className="w-px h-12 bg-border" />
                    )}


                  </div>
                ))}
              </div>
            </div>
            {/* image */}
            <Image
              src="https://images.shadcnspace.com/assets/backgrounds/stats-01.webp"
              alt="user-img"
              width={211}
              height={168}
              className="absolute bottom-0 right-0 hidden sm:block rounded-2xl"
            />
          </CardContent>
        </Card>
      </div>
      {secondaryStats.map((stat, index) => (
        <div key={index} className="col-span-12 sm:col-span-6 xl:col-span-3 min-h-36">
          <Card className="py-6 ring-0 rounded-2xl min-h-40">
            <CardContent className="px-6 flex items-start justify-between min-h-36">
              <div className="flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-10">
                  <p className="text-xl font-semibold text-card-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-semibold text-card-foreground">
                      {stat.value}
                    </p>
                    <Badge
                      className={cn(
                        "font-normal text-foreground",
                        stat.isPositive !== false
                          ? "bg-teal-400/25"
                          : "bg-red-500/25",
                      )}
                    >
                      {stat.percentage}
                    </Badge>
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
