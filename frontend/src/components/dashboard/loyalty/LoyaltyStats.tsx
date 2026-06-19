"use client";
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card";
import { Box, ChartColumnIncreasing, Handbag, UserCheck } from "lucide-react";


export default function LoyaltyStats({ classname }: { classname?: string }) {
    const EcommerceActions = [
        {
            title: "Points Reedemed",
            subtitle: "1200",
            cardIcon: Handbag,

        },
        {
            title: "Points Issued",
            subtitle: "5900",
            cardIcon: Box,

        },
        {
            title: "Repeat Customers",
            subtitle: "45%",
            cardIcon: ChartColumnIncreasing,

        },
        {
            title: "Profile Completion",
            subtitle: "60%",
            cardIcon: UserCheck,

        },
    ];

    return (

        <div className="w-full font-poppins">
            <Card className={cn("p-0 shadow-xs", classname)}>
                <CardContent
                    className="
                flex items-center w-full lg:flex-nowrap flex-wrap px-0
                divide-y md:divide-y-0
                md:divide-x
                divide-border
            "
                >
                    {EcommerceActions.map((item, index) => (
                        <div
                            key={index}
                            className="lg:w-3/12 md:w-6/12 w-full"
                        >
                            <div className="p-6 flex items-start justify-between">
                                <div className="flex flex-col gap-4">
                                    <p className="text-xl font-medium text-card-foreground min-h-14">
                                        {item.title}
                                    </p>
                                    <div>
                                        <p className="text-3xl font-semibold text-card-foreground">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-2 rounded-full outline">
                                    <item.cardIcon size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

    );
}
