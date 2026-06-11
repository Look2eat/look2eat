"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionValidation = void 0;
const zod_1 = require("zod");
exports.subscriptionValidation = {
    createPlan: zod_1.z.object({
        name: zod_1.z.string().min(2, "Plan name is required"),
        durationMonths: zod_1.z
            .number()
            .int()
            .positive("Duration must be greater than 0"),
        price: zod_1.z
            .number()
            .int()
            .positive("Price must be greater than 0"),
    }),
    purchaseSubscription: zod_1.z.object({
        outletId: zod_1.z.string().uuid(),
        planId: zod_1.z.string().uuid(),
    }),
    purchaseCredits: zod_1.z.object({
        outletId: zod_1.z.string().uuid(),
        credits: zod_1.z
            .number()
            .int()
            .positive("Credits must be greater than 0"),
        amountPaid: zod_1.z
            .number()
            .int()
            .positive("Amount paid must be greater than 0"),
    }),
    consumeCredits: zod_1.z.object({
        outletId: zod_1.z.string().uuid(),
        credits: zod_1.z
            .number()
            .int()
            .positive("Credits must be greater than 0"),
        description: zod_1.z.string().optional(),
    }),
};
