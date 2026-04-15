"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRedemptionSchema = exports.processPurchaseSchema = exports.getCustomerInfoSchema = exports.verifyOTPSchema = exports.requestOTPSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod validation schemas for cashier API endpoints
 */
// Request OTP
exports.requestOTPSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    outletId: zod_1.z.string().min(1, 'Outlet ID is required'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
// Verify OTP
exports.verifyOTPSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    otp: zod_1.z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
    outletId: zod_1.z.string().min(1, 'Outlet ID is required'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
// Get customer info
exports.getCustomerInfoSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
// Process purchase
exports.processPurchaseSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
    purchaseAmount: zod_1.z.number().positive('Purchase amount must be greater than 0'),
});
// Process redemption
exports.processRedemptionSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
    milestoneId: zod_1.z.string().min(1, 'Milestone ID is required'),
});
