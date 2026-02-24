interface RewardItemProps {
    pointsRequired: number;
    description: string;
    userPoints: number;
  }
  
  export default function RewardItem({
    pointsRequired,
    description,
    userPoints,
  }: RewardItemProps) {
    const unlocked = userPoints >= pointsRequired || userPoints==-123;
  
    return (
      <div
        className={`py-3 ${
          !unlocked ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          {/* Points */}
          <div>
            <p className="text-2xl font-semibold">
              {pointsRequired}{" "}
              <span className="text-sm font-medium opacity-70">PTS</span>
            </p>
          </div>
  
          {/* Description */}
          <p className="text-right max-w-[60%] text-sm">
            {description}
          </p>
        </div>
  
        {/* Divider */}
        <div className="mt-2 border-t border-white/20" />
      </div>
    );
  }
  