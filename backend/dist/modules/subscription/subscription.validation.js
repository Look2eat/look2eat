"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionSchema = void 0;
const zod_1 = require("zod");
exports.createSubscriptionSchema = zod_1.z.object({
    body: zod_1.z.object({
        outletId: zod_1.z.string().uuid("Invalid outlet ID"),
        planType: zod_1.z.string().min(1, "Plan type is required"),
        durationInMonths: zod_1.z.number().int().min(1, "Duration must be at least 1 month"),
    }),
});
