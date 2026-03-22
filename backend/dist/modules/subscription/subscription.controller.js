"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const subscription_service_1 = require("./subscription.service");
exports.subscriptionController = {
    createSubscription: async (req, res, next) => {
        try {
            const auth = req.auth;
            if (!auth || !auth.brandId) {
                return res.status(401).json({ error: "Unauthorized or missing brand access" });
            }
            const subscription = await subscription_service_1.subscriptionService.createSubscription(auth.sub, auth.brandId, req.body);
            return res.status(201).json({
                message: "Subscription created successfully",
                subscription,
            });
        }
        catch (error) {
            next(error);
        }
    },
    getSubscription: async (req, res, next) => {
        try {
            const outletId = req.params.outletId;
            const auth = req.auth;
            if (!auth || !auth.brandId) {
                return res.status(401).json({ error: "Unauthorized or missing brand access" });
            }
            const subscription = await subscription_service_1.subscriptionService.getSubscriptionByOutlet(outletId, auth.brandId);
            return res.status(200).json({
                subscription,
            });
        }
        catch (error) {
            next(error);
        }
    }
};
