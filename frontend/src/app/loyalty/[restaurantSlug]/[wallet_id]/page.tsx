import HeroBanner from "@/components/customer/HeroBanner";
import HowToRedeem from "@/components/customer/HowToReedem";
import MobileContainer from "@/components/customer/MobileContainer";
import PointsCard from "@/components/customer/PointsCard";
import RestaurantHeader from "@/components/customer/RestaurantHeader";
import RewardsCard from "@/components/customer/RewardCard";
import TermsAndConditions from "@/components/customer/Terms";
import { getPublicLoyaltyPage } from "@/services/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    restaurantSlug: string;
    wallet_id: string;
  };
}

export default async function PublicLoyaltyPage({ params }: PageProps) {
  let pageData;

  try {
    pageData = await getPublicLoyaltyPage(params.restaurantSlug, params.wallet_id);
  } catch {
    notFound();
  }

  const { brand, settings, wallet, milestones } = pageData.data;

  // Find the next milestone the user hasn't unlocked yet
  const nextMilestone = milestones
    .filter((m) => m.coinsRequired > wallet.currentCoins)
    .sort((a, b) => a.coinsRequired - b.coinsRequired)[0];

  // Count how many rewards are already unlocked
  const unlockedRewards = milestones.filter(
    (m) => m.coinsRequired <= wallet.currentCoins
  ).length;

  // Format expiry date
  const expiryDate = new Date(wallet.expiryDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Derive earn rule from coinRatioValue
  // coinRatioValue: 0.4 means ₹1 = 0.4 coins → ₹10 = 4 coins → invert: ₹2.5 per coin
  // Display as: spend ₹X to earn 1 coin
  const spendPerCoin = (1 / settings.coinRatioValue).toFixed(0);
  const earnRule = `₹${spendPerCoin} spent = 1 coin`;

  return (
    <MobileContainer>
      <HeroBanner imageUrl={brand.bannerImageUrl} />
      <RestaurantHeader
        name={brand.name}
        logoUrl={brand.logoUrl}
        bonus={false}
        bonusPoints={0}
      />
      <PointsCard
        userName=""
        points={wallet.currentCoins}
        nextRewardPoints={nextMilestone?.coinsRequired ?? wallet.currentCoins}
        expiryDate={expiryDate}
        rewardCount={unlockedRewards}
      />
      <RewardsCard
        userPoints={wallet.currentCoins}
        earnRule={earnRule}
        rewards={milestones.map((m) => ({
          id: m.id,
          pointsRequired: m.coinsRequired,
          description: `${m.name} — ₹${m.cashbackAmount} cashback`,
        }))}
      />
      <HowToRedeem />
      <TermsAndConditions
        terms={[
          "Points are non-transferable.",
          "Valid only at the brand outlet.",
          "2 Offers cannot be clubbed together",
        ]}
      />
    </MobileContainer>
  );
}