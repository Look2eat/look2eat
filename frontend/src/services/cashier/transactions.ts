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
  name?:string,
): Promise<StandardPurchaseResponse> => {
  const res = await cashierClient.post<StandardPurchaseResponse>(
    "/cashier/transaction/purchase",
    { customerPhoneNumber, brandId, purchaseAmount: amount, name},
  );
  return res.data;
};

// ─── POS purchase (itemised) ───────────────────────────────────────

/**
 * One line of a POS-built order. Field names are deliberately plain
 * ("amount" for unit price, "total" for the line total) so the payload
 * reads the same on the backend without a lookup table.
 */
export interface PosOrderItem {
  name: string;
  amount: number;
  qty: number;
  total: number;
}

export interface PosPurchaseResponse {
  success: boolean;
  data: {
    coinsEarned: number;
    /**
     * The bill's id, if the backend creates one for this order — used to
     * build the shareable /b/[billId] link. Backend contract: return this
     * as `billId` on `data` (a top-level `data.id` is also accepted, for
     * whichever the API ends up calling it). Absent entirely until the
     * backend implements bill creation; the frontend treats that as "no
     * bill for this sale" rather than an error.
     */
    billId?: string;
    id?: string;
  };
}

/**
 * Same endpoint as processStandardPurchase, with the cart's line items
 * attached and purchaseAmount computed from them instead of typed in by
 * hand. The backend can keep crediting coins exactly as before and simply
 * start reading `items` (and returning a bill id) whenever it's ready to.
 */
export const processPosPurchase = async (
  customerPhoneNumber: string,
  brandId: string,
  items: PosOrderItem[],
  name?: string,
  paymentMethod?: string,
): Promise<PosPurchaseResponse> => {
  const purchaseAmount = items.reduce((sum, item) => sum + item.total, 0);
  const res = await cashierClient.post<PosPurchaseResponse>(
    "/cashier/transaction/purchase",
    { customerPhoneNumber, brandId, purchaseAmount, name, items, paymentMethod:"CASH" },
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
