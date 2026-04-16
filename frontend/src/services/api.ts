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

export const processStandardPurchase = async (
  customerPhoneNumber: string, 
  brandId: string, 
  purchaseAmount: number
) => {
  return fetchApi<unknown>('/cashier/transaction/purchase', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, purchaseAmount }),
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

export const processRedemption = async (
  customerPhoneNumber: string, 
  brandId: string, 
  milestoneId: string, 
  purchaseAmount: number
) => {
  return fetchApi<unknown>('/cashier/transaction/redeem', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, milestoneId, purchaseAmount }),
  });
};
