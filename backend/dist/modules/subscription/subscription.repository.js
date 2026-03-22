"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRepository = void 0;
const client_1 = require("../../prisma/client");
exports.subscriptionRepository = {
    findByOutletId: (outletId) => client_1.prisma.subscription.findUnique({
        where: { outletId },
    }),
    createSubscription: (data) => client_1.prisma.subscription.create({
        data,
    }),
    updateSubscriptionStatus: (outletId, status) => client_1.prisma.subscription.update({
        where: { outletId },
        data: { status },
    }),
};
