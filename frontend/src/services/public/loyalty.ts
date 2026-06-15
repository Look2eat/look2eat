import { publicClient } from "../http/publicClient";

/**
 * Matches the REAL confirmed response of GET /public/loyalty/{slug}.
 * Genuinely public — no Authorization header needed or sent.
 */
export interface PublicLoyaltyResponse {
  data: {
    brand: {
      id: string;
      name: string;
      logoUrl: string | null;
      bannerImageUrl: string | null;
      description: string | null;
    };
    settings: {
      coinRatioValue: number;
    };
    milestones: unknown[];
  };
}

export const getPublicLoyaltyBySlug = async (
  slug: string,
): Promise<PublicLoyaltyResponse> => {
  const res = await publicClient.get<PublicLoyaltyResponse>(
    `/public/loyalty/${slug}`,
  );
  return res.data;
};