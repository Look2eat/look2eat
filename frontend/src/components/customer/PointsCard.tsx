interface PointsCardProps {
    userName: string;
    points: number;
    nextRewardPoints: number; // total needed for next reward
    expiryDate: string;
    cardColor?: string; // optional theme color
    rewardCount?: number;
}

export default function PointsCard({
    userName,
    points,
    nextRewardPoints,
    expiryDate,
    cardColor = "#3b2a26", // default dark brown
    rewardCount = 2
}: PointsCardProps) {
    const progress = Math.min((points / nextRewardPoints) * 100, 100);
    const remaining = nextRewardPoints - points;

    return (
        <div className="mx-5 mt-6  flex flex-col ">
            {rewardCount>0 && 
            <div className="flex justify-center">
                <div className="bg-green-100 text-green-700 px-5 pt-2 pb-1 rounded-t-xl text-sm font-semibold">
                    🎉 {rewardCount} Rewards Unlocked
                </div>
            </div>
}

            <div
                className=" p-4  rounded-2xl text-white"
                style={{ backgroundColor: cardColor }}
            >
                {/* Top Row */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium">Hello {userName}</h2>
                    </div>

                    <p className="text-xs opacity-70 text-right">
                        (Points Expires {expiryDate})
                    </p>
                </div>

                {/* Points */}
                <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-bold">{points}</span>
                    <span className="text-lg opacity-80 mb-1">PTS</span>
                </div>

                {/* Progress Bar */}
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
            </div>
        </div>
    );
}
