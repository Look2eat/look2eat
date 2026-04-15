"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const admin_repository_1 = require("./admin.repository");
const AppError_1 = require("../../common/errors/AppError");
exports.adminService = {
    // Brand Coin Ratio Management
    async setBrandCoinRatio(brandId, coinRatioValue) {
        if (coinRatioValue <= 0) {
            throw new AppError_1.AppError("Coin ratio must be greater than 0", 400);
        }
        const existing = await admin_repository_1.adminRepository.getBrandSettings(brandId);
        if (existing) {
            return admin_repository_1.adminRepository.updateBrandSettings(brandId, coinRatioValue);
        }
        return admin_repository_1.adminRepository.createBrandSettings(brandId, coinRatioValue);
    },
    async getBrandCoinRatio(brandId) {
        const settings = await admin_repository_1.adminRepository.getBrandSettings(brandId);
        if (!settings) {
            throw new AppError_1.AppError("Brand settings not found", 404);
        }
        return settings;
    },
    // Cashier Management
    async createCashier(outletId, phoneNumber, name) {
        // Validate phone number format (basic)
        if (!/^\d{10}$/.test(phoneNumber)) {
            throw new AppError_1.AppError("Phone number must be 10 digits without country code", 400);
        }
        // Check if cashier already exists
        const existing = await admin_repository_1.adminRepository.getCashierByPhone(outletId, phoneNumber);
        if (existing) {
            throw new AppError_1.AppError("Cashier with this phone number already exists", 409);
        }
        // Generate random 6-digit temp password
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const cashier = await admin_repository_1.adminRepository.createCashier(outletId, phoneNumber, name, tempPassword);
        return {
            id: cashier.id,
            phoneNumber: cashier.phoneNumber,
            name: cashier.name,
            tempPassword, // Return so admin can share with cashier
        };
    },
    async getCashiersByOutlet(outletId) {
        return admin_repository_1.adminRepository.getCashiersByOutlet(outletId);
    },
    async deactivateCashier(cashierId) {
        return admin_repository_1.adminRepository.updateCashierStatus(cashierId, false);
    },
    async reactivateCashier(cashierId) {
        return admin_repository_1.adminRepository.updateCashierStatus(cashierId, true);
    },
    // Reward Milestone Management
    async createRewardMilestone(brandId, name, coinsRequired, cashbackAmount) {
        if (coinsRequired <= 0 || cashbackAmount <= 0) {
            throw new AppError_1.AppError("Coins and cashback must be greater than 0", 400);
        }
        // Check if milestone already exists for this coin level
        const milestones = await admin_repository_1.adminRepository.getRewardMilestonesByBrand(brandId);
        if (milestones.some((m) => m.coinsRequired === coinsRequired)) {
            throw new AppError_1.AppError(`Milestone for ${coinsRequired} coins already exists`, 409);
        }
        return admin_repository_1.adminRepository.createRewardMilestone(brandId, name, coinsRequired, cashbackAmount);
    },
    async getRewardMilestones(brandId) {
        return admin_repository_1.adminRepository.getRewardMilestonesByBrand(brandId);
    },
    async updateRewardMilestone(milestoneId, coinsRequired, cashbackAmount) {
        if ((coinsRequired !== undefined && coinsRequired <= 0) ||
            (cashbackAmount !== undefined && cashbackAmount <= 0)) {
            throw new AppError_1.AppError("Coins and cashback must be greater than 0", 400);
        }
        return admin_repository_1.adminRepository.updateRewardMilestone(milestoneId, coinsRequired, cashbackAmount);
    },
    // Transaction History
    async getTransactionHistory(brandId, limit = 50, offset = 0, filters) {
        let transactions;
        if (filters?.customerPhone) {
            transactions = await admin_repository_1.adminRepository.getTransactionsByCustomerPhone(brandId, filters.customerPhone);
        }
        else if (filters?.startDate && filters?.endDate) {
            transactions = await admin_repository_1.adminRepository.getTransactionsByDateRange(brandId, filters.startDate, filters.endDate);
        }
        else {
            transactions = await admin_repository_1.adminRepository.getTransactionsByBrandId(brandId, limit, offset);
        }
        // Apply type filter if specified
        if (filters?.type) {
            transactions = transactions.filter((t) => t.type === filters.type);
        }
        return transactions;
    },
    async getTransactionStats(brandId) {
        const allTransactions = await admin_repository_1.adminRepository.getTransactionsByBrandId(brandId, 999999, 0);
        const totalTransactions = allTransactions.length;
        const totalPurchases = allTransactions.filter((t) => t.type === "PURCHASE").length;
        const totalRedemptions = allTransactions.filter((t) => t.type === "REDEMPTION").length;
        const totalCoinsEarned = allTransactions.reduce((sum, t) => sum + (t.coinsEarned || 0), 0);
        const totalCoinsRedeemed = allTransactions.reduce((sum, t) => sum + (t.coinsRedeemed || 0), 0);
        const totalCashbackGiven = allTransactions.reduce((sum, t) => sum + (t.cashbackApplied || 0), 0);
        return {
            totalTransactions,
            totalPurchases,
            totalRedemptions,
            totalCoinsEarned,
            totalCoinsRedeemed,
            totalCashbackGiven,
        };
    },
    async getBrandsList() {
        return admin_repository_1.adminRepository.getBrandsWithStats();
    },
};
