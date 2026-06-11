export interface CreatePlanInput {
  name: string;
  durationMonths: number;
  price: number;
}

export interface PurchaseSubscriptionInput {
  outletId: string;
  planId: string;
}

export interface PurchaseCreditsInput {
  outletId: string;
  credits: number;
  amountPaid: number;
}

export interface ConsumeCreditsInput {
  outletId: string;
  credits: number;
  description?: string;
}