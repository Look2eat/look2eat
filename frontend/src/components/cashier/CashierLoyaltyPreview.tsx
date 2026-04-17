import { Customer } from "@/types/customer";
import { useState } from "react";
import RedeemOtpModal from "./OtpLayout";
import BillAmountModal from "./LoyaltyPayment";
import { requestCustomerOtp } from "@/services/api";

interface Props extends Customer {
    rewards: {
        id: string;
        pointsRequired: number;
        description: string;
    }[];
    promotionalrewards?: {
        id: string,
        description: string;
        expiry: Date;
    }[]
    onOtpSuccess?: () => void;
    brandId: string;  // add
}

export default function CashierLoyaltyPreview({
    name,
    points,
    rewards,
    expiryDate,
    negativeReview,
    lastVisit,
    promotionalrewards = [],
    onOtpSuccess,
    phone,      // add
    brandId,    // add
}: Props) {
    const [selectedReward, setSelectedReward] = useState<{
        id: string;          // add id
        description: string;
        pointsRequired: number;
    } | null>(null);

    const [billModalOpen, setBillModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [billAmount, setBillAmount] = useState("");
    const [promoOpen, setPromoOpen] = useState(false);

    async function handleOpenOtp(amount: string) {
        setBillAmount(amount);
        try {
            await requestCustomerOtp(phone, brandId);
        } catch {
            console.error("Failed to send OTP");
        }
        setBillModalOpen(false);
        setOtpModalOpen(true);  // open only after OTP request completes
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 dark:text-black">Loyalty Program</h2>

            {!phone && (
                <div className="space-y-4">
                    {rewards.map((reward) => (
                        <div
                            key={reward.id}
                            className="bg-[#3b2a26] text-white p-5 rounded-2xl shadow-md flex justify-between"
                        >
                            <span className="font-semibold">{reward.pointsRequired} PTS</span>
                            <span className="text-sm text-right max-w-[60%]">{reward.description}</span>
                        </div>
                    ))}
                </div>
            )}

            {phone && (
                <div className="space-y-6">
                    {(() => {
                        const unlockedRewards = rewards.filter((r) => points! >= r.pointsRequired);
                        const lockedRewards = rewards.filter((r) => points! < r.pointsRequired);

                        if (!phone || points === undefined) return null;

                        const sortedRewards = [...rewards].sort((a, b) => a.pointsRequired - b.pointsRequired);
                        const nextReward = sortedRewards.find((r) => r.pointsRequired > points);

                        let progress = 100;
                        let remaining = 0;

                        if (nextReward) {
                            progress = Math.min((points / nextReward.pointsRequired) * 100, 100);
                            remaining = nextReward.pointsRequired - points;
                        }

                        return (
                            <>
                                <div className="bg-[#3b2a26] text-white p-6 rounded-2xl space-y-6">

                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-medium">Hello {name}</h2>
                                        <p className="text-xs opacity-70 text-right">(Points Expires {expiryDate})</p>
                                    </div>

                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-4xl font-bold">{points}</span>
                                        <span className="text-lg opacity-80 mb-1">PTS</span>
                                    </div>

                                    <div className="mt-5">
                                        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm opacity-80">
                                            {remaining > 0 ? `${remaining} Points to next reward` : "Reward Unlocked 🎉"}
                                        </p>
                                    </div>

                                    {promotionalrewards.length > 0 && (
                                        <div>
                                            <div
                                                onClick={() => setPromoOpen(!promoOpen)}
                                                className="bg-white text-black p-5 rounded-2xl font-bold cursor-pointer flex justify-between items-center"
                                            >
                                                <span>Promotional Offers</span>
                                                <span className={`transition-transform duration-300 ${promoOpen ? "rotate-180" : ""}`}>▼</span>
                                            </div>

                                            <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${promoOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                                                {promotionalrewards.map((promo, index) => (
                                                    <div key={promo.id}>
                                                        <div className="p-4 flex justify-between items-center text-black">
                                                            <div>
                                                                <p className="font-semibold">{promo.description}</p>
                                                                <p className="text-xs opacity-70">
                                                                    Expires {new Date(promo.expiry).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedReward({ id: promo.id, description: promo.description, pointsRequired: 0 });
                                                                    setBillModalOpen(true);
                                                                }}
                                                                className="bg-[#3b2a26] text-white px-4 py-1 rounded-lg text-sm"
                                                            >
                                                                Redeem
                                                            </button>
                                                        </div>
                                                        {index !== promotionalrewards.length - 1 && (
                                                            <div className="border-t border-gray-200 mx-4" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {lastVisit && (
                                        <div className="bg-[#FFD178] text-black p-5 rounded-2xl font-bold text-center">
                                            Last Visit {lastVisit} ago
                                        </div>
                                    )}

                                    {negativeReview && (
                                        <div className="bg-[#FF5A5A] text-white p-5 rounded-2xl font-bold text-center">
                                            Customer has left a negative review
                                        </div>
                                    )}

                                    {unlockedRewards.map((reward) => (
                                        <div
                                            key={reward.id}
                                            className="bg-white text-black p-4 rounded-xl flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-semibold">{reward.pointsRequired} PTS</p>
                                                <p className="text-sm">{reward.description}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedReward({ id: reward.id, description: reward.description, pointsRequired: reward.pointsRequired });
                                                    setBillModalOpen(true);
                                                }}
                                                className="bg-[#3b2a26] text-white px-4 py-1 rounded-lg text-sm"
                                            >
                                                Redeem
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {lockedRewards.map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="bg-[#3b2a26] text-white p-5 rounded-2xl opacity-50"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-semibold">{reward.pointsRequired} PTS</span>
                                            <span className="text-sm max-w-[60%] text-right">{reward.description}</span>
                                        </div>
                                    </div>
                                ))}

                                <BillAmountModal
                                    open={billModalOpen}
                                    onOpenChange={setBillModalOpen}
                                    customerName={name}
                                    onContinue={handleOpenOtp}
                                />

                                <RedeemOtpModal
                                    open={otpModalOpen}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            setOtpModalOpen(false);
                                            setSelectedReward(null);
                                        }
                                    }}
                                    rewardName={selectedReward?.description || ""}
                                    rewardPoints={selectedReward?.pointsRequired || 0}
                                    name={name}
                                    billAmount={billAmount}
                                    customerPhone={phone}
                                    brandId={brandId}
                                    milestoneId={selectedReward?.id || ""}
                                    onConfirm={() => {
                                        onOtpSuccess?.();
                                    }}
                                />
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}