"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = void 0;
const client_1 = require("../../prisma/client");
exports.adminRepository = {
    async getBrandSettings(brandId) {
        return client_1.prisma.brandSettings.findUnique({
            where: { brandId },
        });
    },
    async createBrandSettings(data) {
        return client_1.prisma.brandSettings.create({
            data,
        });
    },
    async updateBrandSettings(brandId, coinRatioValue) {
        return client_1.prisma.brandSettings.update({
            where: { brandId },
            data: { coinRatioValue },
        });
    },
    async createCashier(outletId, phoneNumber, name, passwordHash) {
        return client_1.prisma.cashier.create({
            data: {
                outletId,
                phoneNumber,
                name,
                passwordHash,
            },
        });
    },
    async getCashierByPhone(outletId, phoneNumber) {
        return client_1.prisma.cashier.findUnique({
            where: {
                outletId_phoneNumber: { outletId, phoneNumber },
            },
        });
    },
    async getCashiersByOutlet(outletId) {
        return client_1.prisma.cashier.findMany({
            where: { outletId, isActive: true },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                isActive: true,
                createdAt: true,
            },
        });
    },
    async updateCashierStatus(cashierId, isActive) {
        return client_1.prisma.cashier.update({
            where: { id: cashierId },
            data: { isActive },
        });
    },
    async updateBrandImages(brandId, logoUrl, bannerImageUrl) {
        return client_1.prisma.brand.update({
            where: { id: brandId },
            data: {
                ...(logoUrl && { logoUrl }),
                ...(bannerImageUrl && { bannerImageUrl }),
            },
        });
    },
    async createRewardMilestone(brandId, name, coinsRequired, cashbackAmount) {
        return client_1.prisma.rewardMilestone.create({
            data: {
                brandId,
                name,
                coinsRequired,
                cashbackAmount,
            },
        });
    },
    async getRewardMilestonesByBrand(brandId) {
        return client_1.prisma.rewardMilestone.findMany({
            where: { brandId, isActive: true },
            orderBy: { coinsRequired: "asc" },
        });
    },
    async updateRewardMilestone(milestoneId, coinsRequired, cashbackAmount) {
        return client_1.prisma.rewardMilestone.update({
            where: { id: milestoneId },
            data: {
                ...(coinsRequired && { coinsRequired }),
                ...(cashbackAmount && { cashbackAmount }),
            },
        });
    },
    async getTransactionsByBrandId(brandId, limit = 50, offset = 0) {
        return client_1.prisma.transaction.findMany({
            where: {
                wallet: {
                    brandId,
                },
            },
            include: {
                wallet: {
                    select: {
                        phoneNumber: true,
                        currentCoins: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        });
    },
    async getTransactionCount(brandId) {
        return client_1.prisma.transaction.count({
            where: {
                wallet: {
                    brandId,
                },
            },
        });
    },
    async getTransactionsByDateRange(brandId, startDate, endDate) {
        return client_1.prisma.transaction.findMany({
            where: {
                wallet: {
                    brandId,
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                wallet: {
                    select: {
                        phoneNumber: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async getTransactionsByCustomerPhone(brandId, phoneNumber) {
        return client_1.prisma.transaction.findMany({
            where: {
                wallet: {
                    brandId,
                    phoneNumber,
                },
            },
            include: {
                wallet: {
                    select: {
                        phoneNumber: true,
                        currentCoins: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async getBrandsWithStats() {
        const brands = await client_1.prisma.brand.findMany({
            where: { isActive: true },
            include: {
                outlets: true,
                settings: true,
            },
        });
        const brandsWithStats = await Promise.all(brands.map(async (brand) => {
            const transactionCount = await client_1.prisma.transaction.count({
                where: {
                    wallet: {
                        brandId: brand.id,
                    },
                },
            });
            const walletCount = await client_1.prisma.coinWallet.count({
                where: {
                    brandId: brand.id,
                },
            });
            return {
                ...brand,
                transactionCount,
                walletCount,
            };
        }));
        return brandsWithStats;
    },
};
