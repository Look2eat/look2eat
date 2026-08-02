interface PointsCardProps {
  userName: string;
  points: number;
  expiryDate: string;
  earnPercentage?: number;
  rewardCount?: number;
  cardColor?: string;
}

export default function PointsCardAnies({
  userName,
  points,
  expiryDate,
  earnPercentage = 20,
  rewardCount = 0,
  cardColor = "#F2187A",
}: PointsCardProps) {
  return (
    <div className="mx-4 mt-6">
      {points >= 0 && (
        <div className="flex justify-center">
          <div className="bg-green-100 text-green-700 px-6 py-2 rounded-t-2xl font-semibold text-base w-9/10 text-center">
            🎉 {points} coins to spend
          </div>
        </div>
      )}

      <div
        className="relative rounded-3xl text-white px-6 py-7"
        style={{ backgroundColor: cardColor }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          
            <h2 className="text-2xl font-bold">
              Hello {userName}
            </h2>
          
          <p className="text-[10px] opacity-90 text-right">
            (Points Expires {expiryDate})
          </p>
        </div>
        <p className="text-lg mt-2 font-medium">
              Get rewarded On every purchase
            </p>

        {/* Earn */}
        <div className="mt-8">
          <p className="text-2xl">Earn</p>

          <h1 className="text-5xl font-black leading-none mt-1">
            {earnPercentage}%
          </h1>

          <div className="flex justify-between items-end mt-2">
            <p className="text-2xl leading-none">
              Coins on every purchase
            </p>

            <p className="text-lg whitespace-nowrap">
              1 Coin = ₹1
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-b-3 border-dashed border-white" />
      </div>
    </div>
  );
}