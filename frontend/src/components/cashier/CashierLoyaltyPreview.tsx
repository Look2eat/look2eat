// import { use, useEffect } from "react";

import { Customer } from "@/types/customer";
import { useState } from "react";
import RedeemOtpModal from "./OtpLayout";
import BillAmountModal from "./LoyaltyPayment";
interface Props extends Customer {
  rewards: {
    id: string;
    pointsRequired: number;
    description: string;
  }[];
  onOtpSuccess?: () => void;
}

export default function CashierLoyaltyPreview({
  name,
  points,
  rewards,
  expiryDate,
  negativeReview,
  lastVisit,
  onOtpSuccess,
  
}: Props) {
const [selectedReward, setSelectedReward] = useState<{
  description: string;
  pointsRequired: number;
} | null>(null);

const [billModalOpen, setBillModalOpen] = useState(false);
const [otpModalOpen, setOtpModalOpen] = useState(false);
const [billAmount, setBillAmount] = useState("");

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 dark:text-black">Loyalty Program</h2>

            {/* If no user */}
            {!name && (
                <div className="space-y-4">
                    {rewards.map((reward) => (
                        <div
                            key={reward.id}
                            className="bg-[#3b2a26] text-white p-5 rounded-2xl shadow-md flex justify-between"
                        >
                            <span className="font-semibold">
                                {reward.pointsRequired} PTS
                            </span>
                            <span className="text-sm text-right max-w-[60%]">
                                {reward.description}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* If user exists */}
            {name && (
                <div className="space-y-6">
                    {(() => {
                        const unlockedRewards = rewards.filter(
                            (r) => points! >= r.pointsRequired
                        );

                        const lockedRewards = rewards.filter(
                            (r) => points! < r.pointsRequired
                        );

                        if (!name || (points === undefined)) return null;

                        // 1️⃣ Sort rewards ascending
                        const sortedRewards = [...rewards].sort(
                            (a, b) => a.pointsRequired - b.pointsRequired
                        );

                        // 2️⃣ Find next reward
                        const nextReward = sortedRewards.find(
                            (r) => r.pointsRequired > points
                        );

                        // 3️⃣ Calculate progress safely
                        let progress = 100;
                        let remaining = 0;

                        if (nextReward) {
                            progress = Math.min(
                                (points / nextReward.pointsRequired) * 100,
                                100
                            );
                            remaining = nextReward.pointsRequired - points;
                        }
                        console.log(expiryDate)
                        

                        return (
                            <>
                                {/* Brown Panel */}
                                <div className="bg-[#3b2a26] text-white p-6 rounded-2xl space-y-6">

                                    {/* User Info */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-medium">Hello {name}</h2>
                                        </div>

                                        <p className="text-xs opacity-70 text-right">
                                            (Points Expires {expiryDate})
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-4xl font-bold">{points}</span>
                                        <span className="text-lg opacity-80 mb-1">PTS</span>
                                    </div>
                                    { }
                                    <div className="mt-5">
                                        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <p className="mt-2 text-sm opacity-80">
                                            {remaining > 0
                                                ? `${remaining} Points to next reward`
                                                : "Reward Unlocked 🎉"}
                                        </p>
                                    </div>

                                    {lastVisit && <div className="bg-[#FFD178] text-black p-5 rounded-2xl font-bold text-center" >Last Visit {lastVisit} ago</div>}

                                    {negativeReview && <div className="bg-[#FF5A5A] text-white p-5 rounded-2xl font-bold text-center" >Customer has left a negative review</div>}

                                    {/* Unlocked Rewards Inside Panel */}
                                    {unlockedRewards.map((reward) => (
                                        <div
                                            key={reward.id}
                                            className="bg-white text-black p-4 rounded-xl flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {reward.pointsRequired} PTS
                                                </p>
                                                <p className="text-sm">
                                                    {reward.description}
                                                </p>
                                            </div>

                                            <button
  onClick={() => {
  setSelectedReward({
    description: reward.description,
    pointsRequired: reward.pointsRequired,
  });
  setBillModalOpen(true); // 🔥 open bill modal first
}}
  className="bg-[#3b2a26] text-white px-4 py-1 rounded-lg text-sm"
>
  Redeem
</button>
                                        </div>
                                    ))}
                                </div>

                                {/* Locked Rewards Outside */}
                                {lockedRewards.map((reward) => (
                                    <div
                                        key={reward.id}
                                        className="bg-[#3b2a26] text-white p-5 rounded-2xl opacity-50"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-semibold">
                                                {reward.pointsRequired} PTS
                                            </span>
                                            <span className="text-sm max-w-[60%] text-right">
                                                {reward.description}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <BillAmountModal
  open={billModalOpen}
  onOpenChange={setBillModalOpen}
  customerName={name}
  onContinue={(amount) => {
    setBillAmount(amount);
    setBillModalOpen(false);

    // Small delay for smooth transition
    setTimeout(() => {
      setOtpModalOpen(true);
    }, 200);
  }}
/>
                               <RedeemOtpModal
  open={otpModalOpen}
  onOpenChange={(open) => {
    if (!open) {
      setOtpModalOpen(false);
      setSelectedReward(null);
    }}}
  rewardName={selectedReward?.description || ""}
  rewardPoints={selectedReward?.pointsRequired || 0}
  name={name}
  billAmount={billAmount}
  onConfirm={() => {
    console.log("Redeem confirmed!");
    onOtpSuccess?.()
    // 🔥 deduct points here later
  }}
/>
                            </>
                        );
                    })()}

                </div>
            )}
        </div>)
}

