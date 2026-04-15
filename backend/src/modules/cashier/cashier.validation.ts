import { z } from 'zod';

export const cashierLoginSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  password: z.string().min(1, 'Password is required'),
  outletId: z.string().min(1, 'Outlet ID is required'),
});

export type CashierLoginRequest = z.infer<typeof cashierLoginSchema>;

export const requestCustomerOTPSchema = z.object({
  customerPhoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  brandId: z.string().min(1, 'Brand ID is required'),
});

export type RequestCustomerOTPRequest = z.infer<typeof requestCustomerOTPSchema>;

export const verifyCustomerOTPSchema = z.object({
  customerPhoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  otp: z.string().regex(/^\d{4}$/, 'OTP must be 4 digits'),
  brandId: z.string().min(1, 'Brand ID is required'),
});

export type VerifyCustomerOTPRequest = z.infer<typeof verifyCustomerOTPSchema>;

export const getCustomerInfoSchema = z.object({
  customerPhoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  brandId: z.string().min(1, 'Brand ID is required'),
});

export type GetCustomerInfoRequest = z.infer<typeof getCustomerInfoSchema>;

export const processPurchaseSchema = z.object({
  customerPhoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  brandId: z.string().min(1, 'Brand ID is required'),
  purchaseAmount: z.number().positive('Purchase amount must be greater than 0'),
});

export type ProcessPurchaseRequest = z.infer<typeof processPurchaseSchema>;

export const processRedemptionSchema = z.object({
  customerPhoneNumber: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  brandId: z.string().min(1, 'Brand ID is required'),
  milestoneId: z.string().min(1, 'Milestone ID is required'),
  purchaseAmount: z.number().positive('Purchase amount must be greater than 0'),
});

export type ProcessRedemptionRequest = z.infer<typeof processRedemptionSchema>;
