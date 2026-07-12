"use client"
import { useState } from "react";
import LoyaltyEditCard from "./LoyaltyEditCard";
import { LoyaltyHeader } from "./LoyaltyHeader";
import LoyaltySettingsDialog from "./setting/LoyaltySettingDialog";

export function LoyaltyCampaign() {
    const [isLoyaltyDialogOpen, setIsLoyaltyDialogOpen] = useState(false)
    return (
        <div className="p-6 bg-white dark:bg-[#121214]  backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col gap-6 justify-between">
            <LoyaltyHeader />
            <LoyaltyEditCard
                imageUrl="/mockups/image.png"
                onPrimaryClick={() => setIsLoyaltyDialogOpen(true)}
            />
            <LoyaltySettingsDialog
                open={isLoyaltyDialogOpen}
                onOpenChange={setIsLoyaltyDialogOpen}
                onSaved={() => {
                    // refresh data if needed
                }}
            />
        </div>
    )
}