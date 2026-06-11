"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierRepository = void 0;
const client_1 = require("../../prisma/client");
exports.cashierRepository = {
    async createCashierSession(cashierId, otp, expiresAt) {
        return client_1.prisma.cashierSession.create({
            data: {
                cashierId,
                otp,
                otpExpiresAt: expiresAt,
            },
        });
    },
    async getCashierSessionByPhone(cashierPhoneNumber, outletId) {
        const cashier = await client_1.prisma.cashier.findUnique({
            where: {
                outletId_phoneNumber: {
                    outletId,
                    phoneNumber: cashierPhoneNumber,
                },
            },
        });
        if (!cashier) {
            return null;
        }
        return client_1.prisma.cashierSession.findFirst({
            where: {
                cashierId: cashier.id,
                otpExpiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    async updateCashierSessionVerified(sessionId, verifiedAt) {
        return client_1.prisma.cashierSession.update({
            where: {
                id: sessionId,
            },
            data: {
                verifiedAt,
            },
        });
    },
    async getCashierByPhoneAndOutlet(phoneNumber, outletId) {
        return client_1.prisma.cashier.findUnique({
            where: {
                outletId_phoneNumber: {
                    outletId,
                    phoneNumber,
                },
            },
            include: {
                outlet: {
                    select: {
                        id: true,
                        brandId: true,
                        name: true,
                    },
                },
            },
        });
    },
    async createCustomerOTPSession(customerPhoneNumber, otp, expiresAt, brandId) {
        return client_1.prisma.customerOTPSession.create({
            data: {
                phoneNumber: customerPhoneNumber,
                otp,
                expiresAt,
                brandId,
                verified: false,
            },
        });
    },
    async getCustomerOTPSession(customerPhoneNumber, brandId) {
        return client_1.prisma.customerOTPSession.findFirst({
            where: {
                phoneNumber: customerPhoneNumber,
                brandId,
                verified: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    async markCustomerOTPVerified(sessionId) {
        return client_1.prisma.customerOTPSession.update({
            where: {
                id: sessionId,
            },
            data: {
                verified: true,
                verifiedAt: new Date(),
            },
        });
    },
    async hasRecentVerifiedSession(customerPhoneNumber, brandId) {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const session = await client_1.prisma.customerOTPSession.findFirst({
            where: {
                phoneNumber: customerPhoneNumber,
                brandId,
                verified: true,
                verifiedAt: {
                    gte: fifteenMinutesAgo,
                },
            },
        });
        return Boolean(session);
    },
};
