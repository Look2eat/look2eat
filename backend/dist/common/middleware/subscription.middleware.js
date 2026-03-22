"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = void 0;
const subscription_repository_1 = require("../../modules/subscription/subscription.repository");
const client_1 = require("@prisma/client");
const checkSubscription = async (req, res, next) => {
    try {
        const outletId = req.body.outletId || req.query.outletId || req.params.outletId;
        if (!outletId) {
            return res.status(400).json({ error: "outletId is required for this operation" });
        }
        const subscription = await subscription_repository_1.subscriptionRepository.findByOutletId(outletId);
        if (!subscription) {
            return res.status(403).json({ error: "No subscription found for this outlet" });
        }
        if (subscription.status === client_1.SubscriptionStatus.EXPIRED) {
            return res.status(403).json({ error: "Outlet subscription is EXPIRED. Access denied." });
        }
        // Attach status for downstream handlers (Orders/Messaging)
        req.subscriptionStatus = subscription.status;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkSubscription = checkSubscription;
