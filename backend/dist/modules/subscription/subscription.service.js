"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = void 0;
const AppError_1 = require("../../common/errors/AppError");
const subscription_repository_1 = require("./subscription.repository");
exports.subscriptionService = {
    async createPlan(name, durationMonths, price) {
        if (!name.trim()) {
            throw new AppError_1.AppError("Plan name is required", 400);
        }
        if (durationMonths <= 0) {
            throw new AppError_1.AppError("Duration must be greater than 0", 400);
        }
        if (price <= 0) {
            throw new AppError_1.AppError("Price must be greater than 0", 400);
        }
        return subscription_repository_1.subscriptionRepository.createPlan(name, durationMonths, price);
    },
    async getPlans() {
        return subscription_repository_1.subscriptionRepository.getPlans();
    },
    async getActiveSubscription(outletId) {
        return subscription_repository_1.subscriptionRepository.getActiveSubscription(outletId);
    },
    async purchaseSubscription(outletId, planId) {
        const plan = await subscription_repository_1.subscriptionRepository.getPlanById(planId);
        if (!plan) {
            throw new AppError_1.AppError("Subscription plan not found", 404);
        }
        await subscription_repository_1.subscriptionRepository.deactivateSubscriptions(outletId);
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);
        return subscription_repository_1.subscriptionRepository.createSubscription(outletId, planId, startDate, endDate);
    },
    async purchaseCredits(outletId, credits, amountPaid) {
        if (credits <= 0) {
            throw new AppError_1.AppError("Credits must be greater than 0", 400);
        }
        if (amountPaid <= 0) {
            throw new AppError_1.AppError("Amount paid must be greater than 0", 400);
        }
        let wallet = await subscription_repository_1.subscriptionRepository.getCreditWallet(outletId);
        if (!wallet) {
            wallet =
                await subscription_repository_1.subscriptionRepository.createCreditWallet(outletId);
        }
        await subscription_repository_1.subscriptionRepository.incrementCredits(outletId, credits);
        await subscription_repository_1.subscriptionRepository.createCreditTransaction(outletId, "PURCHASE", credits, amountPaid, `Purchased ${credits} credits`);
        return subscription_repository_1.subscriptionRepository.getCreditWallet(outletId);
    },
    async consumeCredits(outletId, credits, description) {
        if (credits <= 0) {
            throw new AppError_1.AppError("Credits must be greater than 0", 400);
        }
        const wallet = await subscription_repository_1.subscriptionRepository.getCreditWallet(outletId);
        if (!wallet) {
            throw new AppError_1.AppError("Credit wallet not found", 404);
        }
        if (wallet.balance < credits) {
            throw new AppError_1.AppError("Insufficient credits", 400);
        }
        await subscription_repository_1.subscriptionRepository.decrementCredits(outletId, credits);
        await subscription_repository_1.subscriptionRepository.createCreditTransaction(outletId, "CONSUMPTION", credits, undefined, description ?? "Credits consumed");
        return subscription_repository_1.subscriptionRepository.getCreditWallet(outletId);
    },
    async getCreditBalance(outletId) {
        const wallet = await subscription_repository_1.subscriptionRepository.getCreditWallet(outletId);
        if (!wallet) {
            return {
                balance: 0,
                totalPurchased: 0,
                totalConsumed: 0,
            };
        }
        return wallet;
    },
};
