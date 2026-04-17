const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export interface DashboardKpis {
  data: {
    kpis: {
      totalSales: number;
      totalRewardRedeemed: number;
      redemptionRate: number;
      totalPointsIssued: number;
    };
    graph: {
      customerReturnRate: {
        visit1Time: number;
        visit2Times: number;
        visit3To5Times: number;
        visit6PlusTimes: number;
      };
    };
  };
}
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API Request Failed');
  }

  return data;
}

export const adminLogin = async (phoneNumber: string, password: string, fcmToken?: string) => {
  return fetchApi<unknown>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password, fcmToken }),
  });
};

export const getDashboardKpis = async (brandId: string): Promise<DashboardKpis> => {
  return fetchApi<DashboardKpis>(`/admin/brands/${brandId}/dashboard`, {
    method: 'GET',
  });
};

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
  brandId: string
): Promise<CustomerInfoResponse> => {
  return fetchApi<CustomerInfoResponse>(
    `/cashier/customer/${customerPhoneNumber}?brandId=${brandId}`,
    { method: 'GET' }
  );
};

export interface StandardPurchaseResponse {
  success: boolean;
  data: {
    coinsEarned: number;
    // add other fields if needed
  };
}

// Update processStandardPurchase return type
export const processStandardPurchase = async (
  customerPhone: string,
  brandId: string,
  amount: number
): Promise<StandardPurchaseResponse> => {
  return fetchApi<StandardPurchaseResponse>('/cashier/transaction/purchase', {
    method: 'POST',
    body: JSON.stringify({ customerPhone, brandId, amount }),
  });
};

export const requestCustomerOtp = async (customerPhoneNumber: string, brandId: string) => {
  return fetchApi<unknown>('/cashier/request-customer-otp', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId }),
  });
};

export const verifyCustomerOtp = async (
  customerPhoneNumber: string, 
  brandId: string, 
  otp: string
) => {
  return fetchApi<unknown>('/cashier/verify-customer-otp', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, otp }),
  });
};

// In @/services/api.ts — add this interface
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

// Update processRedemption return type
export const processRedemption = async (
  customerPhone: string,
  brandId: string,
  milestoneId: string,
  amount: number
): Promise<RedemptionResponse> => {
  return fetchApi<RedemptionResponse>('/cashier/transaction/redeem', {
    method: 'POST',
    body: JSON.stringify({ customerPhone, brandId, milestoneId, purchaseAmount: amount }),
  });
};