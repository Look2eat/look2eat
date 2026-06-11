"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRedemptionSchema = exports.processPurchaseSchema = exports.getCustomerInfoSchema = exports.verifyCustomerOTPSchema = exports.requestCustomerOTPSchema = exports.cashierLoginSchema = void 0;
const zod_1 = require("zod");
exports.cashierLoginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    password: zod_1.z.string().min(1, 'Password is required'),
    outletId: zod_1.z.string().min(1, 'Outlet ID is required'),
});
exports.requestCustomerOTPSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
exports.verifyCustomerOTPSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    otp: zod_1.z.string().regex(/^\d{4}$/, 'OTP must be 4 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
exports.getCustomerInfoSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
});
exports.processPurchaseSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
    purchaseAmount: zod_1.z.number().positive('Purchase amount must be greater than 0'),
});
exports.processRedemptionSchema = zod_1.z.object({
    customerPhoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
    brandId: zod_1.z.string().min(1, 'Brand ID is required'),
    milestoneId: zod_1.z.string().min(1, 'Milestone ID is required'),
    purchaseAmount: zod_1.z.number().positive('Purchase amount must be greater than 0'),
});
