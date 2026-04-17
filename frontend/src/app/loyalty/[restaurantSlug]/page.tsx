import HeroBanner from "@/components/customer/HeroBanner";
import HowToRedeem from "@/components/customer/HowToReedem";
import MobileContainer from "@/components/customer/MobileContainer";
import RestaurantHeader from "@/components/customer/RestaurantHeader";
import RewardsTable from "@/components/customer/RewardTable";
import TermsAndConditions from "@/components/customer/Terms";
import { getPublicBrandPage } from "@/services/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    restaurantSlug: string;
  };
}

export default async function LoyaltyPage({ params }: PageProps) {
  let pageData;

  try {
    pageData = await getPublicBrandPage(params.restaurantSlug);
  } catch {
    notFound();
  }

  const { brand, settings, milestones } = pageData.data;

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
      <RewardsTable
        userPoints={-1}
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