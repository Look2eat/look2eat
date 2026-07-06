import { publicClient } from "../http/publicClient";

export interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
  bannerImageUrl: string | null;
  termsText: string | null;
  customerName: string | null;
}

export interface LoyaltySettings {
  coinRatioValue: number;
}

export interface Wallet {
  id: string;
  currentCoins: number;
  expiryDate: string;
  totalCoinsEarned: number;
}

export interface Milestone {
  id: string;
  brandId: string;
  name: string;
  coinsRequired: number;
  cashbackAmount: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackCategory {
  name: string;
  enabled: boolean;
  displayOrder: number;
}

export interface PublicLoyaltyResponse {
  data: {
    brand: Brand;
    settings: LoyaltySettings;
    wallet: Wallet;
    milestones: Milestone[];
    feedbackAlreadyGiven: boolean;
    categories: FeedbackCategory[];
  };
}

export const getPublicLoyaltyData = async (
  slug: string,
  walletId: string,
): Promise<PublicLoyaltyResponse> => {
  const res = await publicClient.get<PublicLoyaltyResponse>(
    `/public/loyalty/${slug}/${walletId}`,
  );
  return res.data;
};