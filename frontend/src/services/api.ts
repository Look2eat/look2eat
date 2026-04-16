const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};


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
  return fetchApi<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password, fcmToken }),
  });
};

export const getDashboardKpis = async (brandId: string) => {
  return fetchApi<any>(`/admin/brands/${brandId}/dashboard`, {
    method: 'GET',
  });
};

export const lookupCustomer = async (customerPhoneNumber: string, brandId: string) => {
  return fetchApi<any>(`/cashier/customer/${customerPhoneNumber}?brandId=${brandId}`, {
    method: 'GET',
  });
};

export const processStandardPurchase = async (
  customerPhoneNumber: string, 
  brandId: string, 
  purchaseAmount: number
) => {
  return fetchApi<any>('/cashier/transaction/purchase', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, purchaseAmount }),
  });
};

export const requestCustomerOtp = async (customerPhoneNumber: string, brandId: string) => {
  return fetchApi<any>('/cashier/request-customer-otp', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId }),
  });
};

export const verifyCustomerOtp = async (
  customerPhoneNumber: string, 
  brandId: string, 
  otp: string
) => {
  return fetchApi<any>('/cashier/verify-customer-otp', {
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
  return fetchApi<any>('/cashier/transaction/redeem', {
    method: 'POST',
    body: JSON.stringify({ customerPhoneNumber, brandId, milestoneId, purchaseAmount }),
  });
};
