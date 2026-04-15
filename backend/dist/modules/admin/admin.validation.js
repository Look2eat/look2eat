"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidation = void 0;
const zod_1 = require("zod");
exports.adminValidation = {
    setBrandCoinRatio: zod_1.z.object({
        brandId: zod_1.z.string().uuid(),
        coinRatioValue: zod_1.z.number().positive("Coin ratio must be greater than 0"),
    }),
    createCashier: zod_1.z.object({
        outletId: zod_1.z.string().uuid(),
        phoneNumber: zod_1.z
            .string()
            .regex(/^\d{10}$/, "Phone number must be 10 digits"),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    }),
    createRewardMilestone: zod_1.z.object({
        brandId: zod_1.z.string().uuid(),
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        coinsRequired: zod_1.z
            .number()
            .positive("Coins required must be greater than 0"),
        cashbackAmount: zod_1.z
            .number()
            .positive("Cashback amount must be greater than 0"),
    }),
    updateRewardMilestone: zod_1.z.object({
        coinsRequired: zod_1.z
            .number()
            .positive("Coins required must be greater than 0")
            .optional(),
        cashbackAmount: zod_1.z
            .number()
            .positive("Cashback amount must be greater than 0")
            .optional(),
    }),
    getTransactionHistory: zod_1.z.object({
        brandId: zod_1.z.string().uuid(),
        limit: zod_1.z.number().int().positive().default(50),
        offset: zod_1.z.number().int().nonnegative().default(0),
        customerPhone: zod_1.z
            .string()
            .regex(/^\d{10}$/, "Phone number must be 10 digits")
            .optional(),
        type: zod_1.z.enum(["PURCHASE", "REDEMPTION"]).optional(),
        startDate: zod_1.z
            .union([zod_1.z.string().datetime(), zod_1.z.instanceof(Date)])
            .transform((val) => (typeof val === "string" ? new Date(val) : val))
            .optional(),
        endDate: zod_1.z
            .union([zod_1.z.string().datetime(), zod_1.z.instanceof(Date)])
            .transform((val) => (typeof val === "string" ? new Date(val) : val))
            .optional(),
    }),
};
