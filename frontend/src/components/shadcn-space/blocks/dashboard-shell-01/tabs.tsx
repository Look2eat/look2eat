"use client"

import * as React from "react"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs_dashboard"
import LoyaltyCard from "./LoyaltyCard"
import MarketingCard from "./MarketingCard"
import FeedbackCard from "./FeedbackCard"

export default function PreviewTabs() {
    return (
        <Tabs defaultValue="tab1" variant="rounded" className="w-full  ">
            <TabsList>
                <TabsTrigger value="tab1">Loyalty </TabsTrigger>
                <TabsTrigger value="tab2">Feedback</TabsTrigger>
                <TabsTrigger value="tab3">Marketing</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1"><LoyaltyCard /></TabsContent>
            <TabsContent value="tab2"><FeedbackCard /></TabsContent>
            <TabsContent value="tab3"><MarketingCard /></TabsContent>
        </Tabs>
    )
}








