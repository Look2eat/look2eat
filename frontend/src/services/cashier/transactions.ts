import { cashierClient } from "@/services/cashier/client";

// ─── Customer Lookup ────────────────────────────────────────────

export interface CustomerInfoResponse {
  success: boolean;
  data: {
    isNewCustomer: boolean;
    customerPhoneNumber: string;
    walletBalance: number;
    coinsExpiry: string;
    name?: string;
    nextMilestone?: {
      coinsRequired: number;
      cashbackAmount: number;
      coinsNeeded: number;
    };
    allMilestones: {
      id: string;
      brandId: string;
      name: string;
      coinsRequired: number;
      cashbackAmount: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    promotionalRewards?: {
      id: string;
      description: string;
      expiry: string;
    }[];
    lastVisit?: string;
    negativeReview?: boolean;
  };
}

export const lookupCustomer = async (
  customerPhoneNumber: string,
  brandId: string,
): Promise<CustomerInfoResponse> => {
  const res = await cashierClient.get<CustomerInfoResponse>(
    `/cashier/customer/${customerPhoneNumber}`,
    { params: { brandId } },
  );
  return res.data;
};

// ─── OTP ────────────────────────────────────────────────────────

export const requestCustomerOtp = async (
  customerPhoneNumber: string,
  brandId: string,
): Promise<void> => {
  await cashierClient.post("/cashier/request-customer-otp", {
    customerPhoneNumber,
    brandId,
  });
};

export const verifyCustomerOtp = async (
  customerPhoneNumber: string,
  brandId: string,
  otp: string,
): Promise<void> => {
  console.log("verifyCustomerOtp() called")
  await cashierClient.post("/cashier/verify-customer-otp", {
    customerPhoneNumber,
    brandId,
    otp,
  });
};

// ─── Transactions ────────────────────────────────────────────────

export interface StandardPurchaseResponse {
  success: boolean;
  data: {
    coinsEarned: number;
  };
}

export const processStandardPurchase = async (
  customerPhoneNumber: string,
  brandId: string,
  amount: number,
): Promise<StandardPurchaseResponse> => {
  const res = await cashierClient.post<StandardPurchaseResponse>(
    "/cashier/transaction/purchase",
    { customerPhoneNumber, brandId, purchaseAmount: amount },
  );
  return res.data;
};

export interface RedemptionResponse {
  success: boolean;
  message: string;
  data: {
    redemptionTransactionId: string;
    purchaseTransactionId: string;
    coinsRedeemed: number;
    cashbackApplied: number;
    purchaseAmount: number;
    coinsEarned: number;
    remainingCoins: number;
    timestamp: string;
  };
}

export const processRedemption = async (
  customerPhoneNumber: string,
  brandId: string,
  milestoneId: string,
  amount: number,
): Promise<RedemptionResponse> => {
  const res = await cashierClient.post<RedemptionResponse>(
    "/cashier/transaction/redeem",
    { customerPhoneNumber, brandId, milestoneId, purchaseAmount: amount },
  );
  return res.data;
};
