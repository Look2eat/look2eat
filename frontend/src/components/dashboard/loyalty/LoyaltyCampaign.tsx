import LoyaltyEditCard from "./LoyaltyEditCard";
import { LoyaltyHeader } from "./LoyaltyHeader";

export function LoyaltyCampaign() {
    return (
        <div className="p-6 bg-muted/40 border border-foreground/6 backdrop-blur-sm transition-all duration-500 foreground/10 rounded-2xl overflow-hidden flex flex-col gap-6 justify-between">
            <LoyaltyHeader />

            {/* Loyalty Campaign Content */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Create a Loyalty Program</h3>
                    <p className="text-muted-foreground mb-4">Design a custom loyalty program to reward your customers for their purchases and engagement.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Get Started</button>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Manage Rewards</h3>
                    <p className="text-muted-foreground mb-4">Easily manage your rewards catalog and track customer redemptions.</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">View Rewards</button>
                </div>
            </div> */}
            <LoyaltyEditCard
                title="Mcdonalds"
                subtitle="Offer via Rewards Points"
                description="₹10 = 1 Coin"
                imageUrl="/mockups/image.png"
            />
        </div>
    )
}