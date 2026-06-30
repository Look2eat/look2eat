/**
 * Wallet / credits service
 * All calls go through /api/proxy/... → Express backend
 * with JWT attached server-side by the proxy route handler.
 */

export interface CreditBalance {
  id: string;
  outletId: string;
  balance: number;
  totalPurchased: number;
  totalConsumed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditBalanceResponse {
  data: CreditBalance;
}

export interface CreditPurchase {
  id: string;
  outletId: string;
  amount: number;
  status: "Success" | "Failed";
  createdAt: string;
  // add more fields if backend returns them
}
export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;       // in paise (₹100 = 10000)
    currency: string;
    keyId: string;
  };
}

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createCreditOrder = async (
  outletId: string,
  credits: number,
): Promise<CreateOrderResponse> => {
  const res = await fetch("/api/proxy/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outletId, type: "CREDIT_PURCHASE", credits }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not create order.");
  return data as CreateOrderResponse;
};

export const verifyPayment = async (
  input: VerifyPaymentInput,
): Promise<void> => {
  const res = await fetch("/api/proxy/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment verification failed.");
};


export interface CreditPurchaseHistoryResponse {
  data: CreditPurchase[];
}

export const getCredits = async (
  outletId: string,
): Promise<CreditBalanceResponse> => {
  const res = await fetch(`/api/proxy/credits/${outletId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Could not fetch credits.");
  }
  return data as CreditBalanceResponse;
};

export const getCreditPurchaseHistory = async (
  outletId: string,
): Promise<CreditPurchaseHistoryResponse> => {
  const res = await fetch(
    `/api/proxy/credits/creditPurchaseHistory/${outletId}`,
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.message || data.error || "Could not fetch recharge history.",
    );
  }
  return data as CreditPurchaseHistoryResponse;
};