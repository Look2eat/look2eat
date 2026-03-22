"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = void 0;
const subscription_repository_1 = require("./subscription.repository");
const client_1 = require("../../prisma/client");
const client_2 = require("@prisma/client");
exports.subscriptionService = {
    createSubscription: async (userId, brandId, data) => {
        // 1. Verify outlet belongs to user's brand
        const outlet = await client_1.prisma.outlet.findUnique({ where: { id: data.outletId } });
        if (!outlet) {
            throw new Error("Outlet not found");
        }
        if (outlet.brandId !== brandId) {
            throw new Error("Unauthorized to create subscription for this outlet");
        }
        // 2. Check if active subscription already exists
        const existing = await subscription_repository_1.subscriptionRepository.findByOutletId(data.outletId);
        if (existing) {
            throw new Error("A subscription already exists for this outlet.");
        }
        // 3. Calculate dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + data.durationInMonths);
        const graceUntil = new Date(endDate);
        graceUntil.setDate(graceUntil.getDate() + 7); // 7 days grace
        // 4. Create in DB
        const subscription = await subscription_repository_1.subscriptionRepository.createSubscription({
            outletId: data.outletId,
            planType: data.planType,
            status: client_2.SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            graceUntil,
        });
        return subscription;
    },
    getSubscriptionByOutlet: async (outletId, userBrandId) => {
        const outlet = await client_1.prisma.outlet.findUnique({ where: { id: outletId } });
        if (!outlet || outlet.brandId !== userBrandId) {
            throw new Error("Outlet not found or unauthorized");
        }
        const subscription = await subscription_repository_1.subscriptionRepository.findByOutletId(outletId);
        if (!subscription) {
            throw new Error("No subscription found for this outlet");
        }
        return subscription;
    }
};
