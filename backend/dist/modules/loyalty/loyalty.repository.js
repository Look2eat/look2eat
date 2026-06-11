"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loyaltyRepository = void 0;
const AppError_1 = require("../../common/errors/AppError");
const client_1 = require("../../prisma/client");
const loyalty_constants_1 = require("./loyalty.constants");
exports.loyaltyRepository = {
    async getOrCreateCoinWallet(customerPhoneNumber, brandId) {
        let wallet = await client_1.prisma.coinWallet.findUnique({
            where: {
                brandId_phoneNumber: {
                    brandId,
                    phoneNumber: customerPhoneNumber,
                },
            },
        });
        if (!wallet) {
            wallet = await client_1.prisma.coinWallet.create({
                data: {
                    phoneNumber: customerPhoneNumber,
                    brandId,
                    currentCoins: 0,
                    expiryDate: new Date(Date.now() +
                        loyalty_constants_1.DEFAULT_EXPIRY_DAYS *
                            24 *
                            60 *
                            60 *
                            1000),
                },
            });
        }
        return wallet;
    },
    async getCustomerWalletWithMilestones(customerPhoneNumber, brandId) {
        const wallet = await exports.loyaltyRepository.getOrCreateCoinWallet(customerPhoneNumber, brandId);
        const milestones = await client_1.prisma.rewardMilestone.findMany({
            where: {
                brandId,
                isActive: true,
            },
            orderBy: {
                coinsRequired: "asc",
            },
        });
        return {
            wallet,
            milestones,
        };
    },
    async isNewCustomer(customerPhoneNumber, brandId) {
        const transaction = await client_1.prisma.transaction.findFirst({
            where: {
                wallet: {
                    phoneNumber: customerPhoneNumber,
                    brandId,
                },
            },
        });
        return !transaction;
    },
    async getBrandSettings(brandId) {
        return client_1.prisma.brandSettings.findUnique({
            where: { brandId },
        });
    },
    async getRewardMilestoneById(milestoneId) {
        return client_1.prisma.rewardMilestone.findUnique({
            where: { id: milestoneId },
        });
    },
    async getBrandName(brandId) {
        const brand = await client_1.prisma.brand.findUnique({
            where: { id: brandId },
            select: {
                name: true,
            },
        });
        return brand?.name ?? null;
    },
    async recordPurchaseTransaction(customerPhoneNumber, brandId, purchaseAmount, coinsEarned, cashierPhoneNumber) {
        const wallet = await exports.loyaltyRepository.getOrCreateCoinWallet(customerPhoneNumber, brandId);
        const transaction = await client_1.prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: "PURCHASE",
                purchaseAmount,
                coinsEarned,
                cashierPhoneNumber,
            },
        });
        const updatedWallet = await client_1.prisma.coinWallet.update({
            where: {
                id: wallet.id,
            },
            data: {
                currentCoins: {
                    increment: coinsEarned,
                },
                totalCoinsEarned: {
                    increment: coinsEarned,
                },
                expiryDate: new Date(Date.now() +
                    loyalty_constants_1.DEFAULT_EXPIRY_DAYS *
                        24 *
                        60 *
                        60 *
                        1000),
            },
        });
        return {
            transaction,
            wallet: updatedWallet,
        };
    },
    async redeemAndPurchase(customerPhoneNumber, brandId, milestoneId, coinsRedeemed, cashbackApplied, purchaseAmount, coinsEarned, cashierPhoneNumber) {
        return client_1.prisma.$transaction(async (tx) => {
            const wallet = await tx.coinWallet.findUnique({
                where: {
                    brandId_phoneNumber: {
                        brandId,
                        phoneNumber: customerPhoneNumber,
                    },
                },
            });
            if (!wallet) {
                throw new AppError_1.AppError("Wallet not found", 404);
            }
            const redemptionTransaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: "REDEMPTION",
                    coinsRedeemed,
                    cashbackApplied,
                    milestoneId,
                    cashierPhoneNumber,
                },
            });
            await tx.coinWallet.update({
                where: {
                    id: wallet.id,
                },
                data: {
                    currentCoins: {
                        decrement: coinsRedeemed,
                    },
                },
            });
            const purchaseTransaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: "PURCHASE",
                    purchaseAmount,
                    coinsEarned,
                    cashierPhoneNumber,
                },
            });
            const updatedWallet = await tx.coinWallet.update({
                where: {
                    id: wallet.id,
                },
                data: {
                    currentCoins: {
                        increment: coinsEarned,
                    },
                    totalCoinsEarned: {
                        increment: coinsEarned,
                    },
                    expiryDate: new Date(Date.now() +
                        loyalty_constants_1.DEFAULT_EXPIRY_DAYS *
                            24 *
                            60 *
                            60 *
                            1000),
                },
            });
            return {
                redemptionTransaction,
                purchaseTransaction,
                wallet: updatedWallet,
            };
        });
    },
};
