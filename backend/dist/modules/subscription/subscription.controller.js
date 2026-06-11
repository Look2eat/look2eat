"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const AppError_1 = require("../../common/errors/AppError");
const subscription_service_1 = require("./subscription.service");
const subscription_validation_1 = require("./subscription.validation");
exports.subscriptionController = {
    async createPlan(req, res) {
        try {
            const { name, durationMonths, price } = subscription_validation_1.subscriptionValidation.createPlan.parse(req.body);
            const plan = await subscription_service_1.subscriptionService.createPlan(name, durationMonths, price);
            res.status(201).json({
                message: "Plan created successfully",
                data: plan,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getPlans(req, res) {
        try {
            const plans = await subscription_service_1.subscriptionService.getPlans();
            res.status(200).json({
                data: plans,
                count: plans.length,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async purchaseSubscription(req, res) {
        try {
            const { outletId, planId } = subscription_validation_1.subscriptionValidation.purchaseSubscription.parse(req.body);
            const subscription = await subscription_service_1.subscriptionService.purchaseSubscription(outletId, planId);
            res.status(201).json({
                message: "Subscription purchased successfully",
                data: subscription,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getActiveSubscription(req, res) {
        try {
            const { outletId } = req.params;
            if (!outletId || Array.isArray(outletId)) {
                throw new AppError_1.AppError("Outlet ID is required", 400);
            }
            const subscription = await subscription_service_1.subscriptionService.getActiveSubscription(outletId);
            res.status(200).json({
                data: subscription,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async purchaseCredits(req, res) {
        try {
            const { outletId, credits, amountPaid, } = subscription_validation_1.subscriptionValidation.purchaseCredits.parse(req.body);
            const wallet = await subscription_service_1.subscriptionService.purchaseCredits(outletId, credits, amountPaid);
            res.status(200).json({
                message: "Credits purchased successfully",
                data: wallet,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async consumeCredits(req, res) {
        try {
            const { outletId, credits, description, } = subscription_validation_1.subscriptionValidation.consumeCredits.parse(req.body);
            const wallet = await subscription_service_1.subscriptionService.consumeCredits(outletId, credits, description);
            res.status(200).json({
                message: "Credits consumed successfully",
                data: wallet,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getCreditBalance(req, res) {
        try {
            const { outletId } = req.params;
            if (!outletId || Array.isArray(outletId)) {
                throw new AppError_1.AppError("Outlet ID is required", 400);
            }
            const wallet = await subscription_service_1.subscriptionService.getCreditBalance(outletId);
            res.status(200).json({
                data: wallet,
            });
        }
        catch (error) {
            throw error;
        }
    },
};
