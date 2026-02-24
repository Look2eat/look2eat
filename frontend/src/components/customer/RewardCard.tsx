import RewardItem from "./RewardItem";

interface Reward {
  id: string;
  pointsRequired: number;
  description: string;
}

interface RewardsCardProps {
  userPoints: number;
  earnRule: string; // e.g. "₹10 spent = 1 coin"
  rewards: Reward[];
  cardColor?: string;
}

export default function RewardsCard({
  userPoints,
  earnRule,
  rewards,
  cardColor = "#3b2a26",
}: RewardsCardProps) {
  return (
    <div
      className="mx-6 mt-6 p-5 rounded-2xl text-white"
      style={{ backgroundColor: cardColor }}
    >
      {/* Earn Rule */}
      <div className="mb-6">
        <p className="text-sm opacity-80">
          Get reward for every purchase
        </p>
        <p className="text-lg font-semibold mt-1">
          {earnRule}
        </p>
      </div>

      {/* Rewards List */}
      <div>
        {rewards.map((reward, index) => (
          <RewardItem
            key={reward.id}
            pointsRequired={reward.pointsRequired}
            description={reward.description}
            userPoints={userPoints}
          />
        ))}
      </div>
    </div>
  );
}
