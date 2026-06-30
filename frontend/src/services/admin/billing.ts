export interface Subscription {
    id: string;
    outletId: string;
    planId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    daysRemaining: number;
    plan: {
        id: string;
        name: string;
        durationMonths: number;
        price: number;
        isActive: boolean;
    };
}

export interface SubscriptionResponse {
    data: Subscription;
}

export interface PurchaseHistoryRow {
    id: string;
    outletId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    type: string;
    status: string;
    referenceId: string;
    createdAt: string;
    updatedAt: string;
}

export interface PurchaseHistoryResponse {
    data: PurchaseHistoryRow[];
}

export const getOutletSubscription = async (
    outletId: string
): Promise<SubscriptionResponse> => {
    const res = await fetch(`/api/proxy/subscriptions/outlets/${outletId}`, {
        method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not fetch subscription.");
    }

    return data as SubscriptionResponse;
};

export const getSubscriptionHistory = async (
    outletId: string
): Promise<PurchaseHistoryResponse> => {
    const res = await fetch(`/api/proxy/subscriptions/subscriptionPurchaseHistory/${outletId}`, {
        method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not fetch billing history.");
    }

    return data as PurchaseHistoryResponse;
};