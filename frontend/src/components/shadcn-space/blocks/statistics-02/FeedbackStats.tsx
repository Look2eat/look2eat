"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Frown, Meh, Smile, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedbackStats({ classname }: { classname?: string }) {
  const EcommerceActions = [
    {
      title: "Total Feedback",
      subtitle: "5868",
      cardIcon: HeartHandshake,


    },
    {
      title: "Positive Feedback",
      subtitle: "70%",
      cardIcon: Smile,
      className: "text-green-500",
    },
    {
      title: "Neutral Feedback",
      subtitle: "20%",
      cardIcon: Meh,
      className: "text-yellow-500",

    },
    {
      title: "Negative Feedback",
      subtitle: "10%",
      cardIcon: Frown,
      className: "text-red-400",

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

                <div className={`pl-2 rounded-full  ${item.className}`}>
                  <item.cardIcon size={28} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

  );
}
