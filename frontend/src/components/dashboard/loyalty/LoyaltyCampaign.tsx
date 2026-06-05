import LoyaltyEditCard from "./LoyaltyEditCard";
import { LoyaltyHeader } from "./LoyaltyHeader";

export function LoyaltyCampaign() {
    return (
        <div className="p-6 bg-white dark:bg-[#121214]  backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col gap-6 justify-between">
            <LoyaltyHeader />
            <LoyaltyEditCard
                title="Mcdonalds"
                subtitle="Offer via Rewards Points"
                description="₹10 = 1 Coin"
                imageUrl="/mockups/image.png"
            />
        </div>
    )
}