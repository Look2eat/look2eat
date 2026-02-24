import HeroBanner from "@/components/customer/HeroBanner";
import HowToRedeem from "@/components/customer/HowToReedem";
import MobileContainer from "@/components/customer/MobileContainer";
import PointsCard from "@/components/customer/PointsCard";
import RestaurantHeader from "@/components/customer/RestaurantHeader";
import RewardsCard from "@/components/customer/RewardCard";
import RewardsTable from "@/components/customer/RewardTable";
import TermsAndConditions from "@/components/customer/Terms";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    restaurantSlug: string;
  };
}



export default async function LoyaltyPage() {
  return (

    <MobileContainer>
      <HeroBanner imageUrl="https://plus.unsplash.com/premium_photo-1683655058756-9b928d9e96c8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></HeroBanner>
      <RestaurantHeader name="Mcdonald's" logoUrl="https://images.unsplash.com/photo-1767868281101-fd99e41148c4?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" bonus={false} bonusPoints={40} />
      
      <RewardsTable
        userPoints={-123}
        earnRule="₹10 spent = 1 coin"
        rewards={[
          {
            id: "1",
            pointsRequired: 200,
            description: "Welcome to our Loyalty Club. Get ₹50 off",
          },
          {
            id: "2",
            pointsRequired: 500,
            description: "Get a free Cappuccino Coffee",
          },
          {
            id: "3",
            pointsRequired: 1000,
            description: "Party Time Get ₹500 off on your next purchase",
          },
          {
            id: "4",
            pointsRequired: 2000,
            description: "You love us! Get ₹1000 off",
          },
        ]}
      />
      <HowToRedeem />

      <TermsAndConditions
        terms={[
          "Points are non-transferable.",
          "Valid only at the barand outlet.",
          "2 Offers cannot be clubbed together",
        ]}
      />
    </MobileContainer>

  );
}
