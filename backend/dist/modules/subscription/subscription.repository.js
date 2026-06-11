"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRepository = void 0;
const client_1 = require("../../prisma/client");
exports.subscriptionRepository = {
    async createPlan(name, durationMonths, price) {
        return client_1.prisma.subscriptionPlan.create({
            data: {
                name,
                durationMonths,
                price,
            },
        });
    },
    async getPlans() {
        return client_1.prisma.subscriptionPlan.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                price: "asc",
            },
        });
    },
    async getPlanById(planId) {
        return client_1.prisma.subscriptionPlan.findUnique({
            where: {
                id: planId,
            },
        });
    },
    async createSubscription(outletId, planId, startDate, endDate) {
        return client_1.prisma.outletSubscription.create({
            data: {
                outletId,
                planId,
                startDate,
                endDate,
            },
            include: {
                plan: true,
            },
        });
    },
    async getActiveSubscription(outletId) {
        return client_1.prisma.outletSubscription.findFirst({
            where: {
                outletId,
                isActive: true,
                endDate: {
                    gt: new Date(),
                },
            },
            include: {
                plan: true,
            },
            orderBy: {
                endDate: "desc",
            },
        });
    },
    async deactivateSubscriptions(outletId) {
        return client_1.prisma.outletSubscription.updateMany({
            where: {
                outletId,
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    },
    async getCreditWallet(outletId) {
        return client_1.prisma.platformCreditWallet.findUnique({
            where: {
                outletId,
            },
        });
    },
    async createCreditWallet(outletId) {
        return client_1.prisma.platformCreditWallet.create({
            data: {
                outletId,
            },
        });
    },
    async incrementCredits(outletId, credits) {
        return client_1.prisma.platformCreditWallet.update({
            where: {
                outletId,
            },
            data: {
                balance: {
                    increment: credits,
                },
                totalPurchased: {
                    increment: credits,
                },
            },
        });
    },
    async decrementCredits(outletId, credits) {
        return client_1.prisma.platformCreditWallet.update({
            where: {
                outletId,
            },
            data: {
                balance: {
                    decrement: credits,
                },
                totalConsumed: {
                    increment: credits,
                },
            },
        });
    },
    async createCreditTransaction(outletId, type, credits, amountPaid, description) {
        return client_1.prisma.creditTransaction.create({
            data: {
                outletId,
                type,
                credits,
                amountPaid,
                description,
            },
        });
    },
};
