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

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    brandId: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    brand: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export const adminLogin = async (phoneNumber: string, password: string, fcmToken?: string) => {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone: phoneNumber, password, fcmToken }),
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
  customerPhoneNumber: string,
  brandId: string,
  amount: number
): Promise<StandardPurchaseResponse> => {
  return fetchApi<StandardPurchaseResponse>('/cashier/transaction/purchase', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, purchaseAmount:amount }),
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
export interface PublicLoyaltyResponse {
  data: {
    brand: {
      id: string;
      name: string;
      logoUrl: string;
      bannerImageUrl: string;
    };
    settings: {
      coinRatioValue: number;
    };
    wallet: {
      id: string;
      currentCoins: number;
      expiryDate: string;
      totalCoinsEarned: number;
    };
    milestones: {
      id: string;
      brandId: string;
      name: string;
      coinsRequired: number;
      cashbackAmount: number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export const getPublicLoyaltyPage = async (
  restaurantSlug: string,
  walletId: string
): Promise<PublicLoyaltyResponse> => {
  return fetchApi<PublicLoyaltyResponse>(
    `/public/loyalty/${restaurantSlug}/${walletId}`,
    { method: "GET" }
  );
};
export interface PublicBrandPageResponse {
  data: {
    brand: {
      id: string;
      name: string;
      logoUrl: string;
      bannerImageUrl: string;
    };
    settings: {
      coinRatioValue: number;
    };
    milestones: {
      id: string;
      name: string;
      coinsRequired: number;
      cashbackAmount: number;
      isActive: boolean;
    }[];
  };
}

export const getPublicBrandPage = async (
  restaurantSlug: string
): Promise<PublicBrandPageResponse> => {
  return fetchApi<PublicBrandPageResponse>(
    `/public/loyalty/${restaurantSlug}`,
    { method: "GET" }
  );
};
// Update processRedemption return type
export const processRedemption = async (
  customerPhoneNumber: string,
  brandId: string,
  milestoneId: string,
  amount: number
): Promise<RedemptionResponse> => {
  return fetchApi<RedemptionResponse>('/cashier/transaction/redeem', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, milestoneId, purchaseAmount: amount }),
  });
};