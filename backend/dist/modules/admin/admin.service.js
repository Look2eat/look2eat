"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const admin_repository_1 = require("./admin.repository");
const AppError_1 = require("../../common/errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
exports.adminService = {
    async setBrandCoinRatio(brandId, coinRatioValue) {
        if (coinRatioValue <= 0) {
            throw new AppError_1.AppError("Coin ratio must be greater than 0", 400);
        }
        const existing = await admin_repository_1.adminRepository.getBrandSettings(brandId);
        if (existing) {
            return admin_repository_1.adminRepository.updateBrandSettings(brandId, coinRatioValue);
        }
        return admin_repository_1.adminRepository.createBrandSettings({ brandId, coinRatioValue });
    },
    async getBrandCoinRatio(brandId) {
        const settings = await admin_repository_1.adminRepository.getBrandSettings(brandId);
        if (!settings) {
            throw new AppError_1.AppError("Brand settings not found", 404);
        }
        return settings;
    },
    async uploadBrandImages(brandId, logoUrl, bannerImageUrl) {
        if (!logoUrl && !bannerImageUrl) {
            throw new AppError_1.AppError("No images provided for upload", 400);
        }
        return admin_repository_1.adminRepository.updateBrandImages(brandId, logoUrl, bannerImageUrl);
    },
    async createCashier(outletId, phoneNumber, name) {
        if (!/^\d{10}$/.test(phoneNumber)) {
            throw new AppError_1.AppError("Phone number must be 10 digits without country code", 400);
        }
        const existing = await admin_repository_1.adminRepository.getCashierByPhone(outletId, phoneNumber);
        if (existing) {
            throw new AppError_1.AppError("Cashier with this phone number already exists", 409);
        }
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordHash = await bcrypt_1.default.hash(tempPassword, SALT_ROUNDS);
        const cashier = await admin_repository_1.adminRepository.createCashier(outletId, phoneNumber, name, passwordHash);
        return {
            id: cashier.id,
            phoneNumber: cashier.phoneNumber,
            name: cashier.name,
            tempPassword,
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
    async createRewardMilestone(brandId, name, coinsRequired, cashbackAmount) {
        if (coinsRequired <= 0 || cashbackAmount <= 0) {
            throw new AppError_1.AppError("Coins and cashback must be greater than 0", 400);
        }
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
    async getDashboardData(brandId) {
        const allTransactions = await admin_repository_1.adminRepository.getTransactionsByBrandId(brandId, 999999, 0);
        let totalSales = 0;
        let totalPointsIssued = 0;
        let purchasesCount = 0;
        let redemptionsCount = 0;
        const customerVisits = {};
        for (const tx of allTransactions) {
            if (tx.type === "PURCHASE") {
                totalSales += (tx.purchaseAmount || 0);
                totalPointsIssued += (tx.coinsEarned || 0);
                purchasesCount++;
                const customerIdentifier = tx.walletId || "unknown";
                customerVisits[customerIdentifier] = (customerVisits[customerIdentifier] || 0) + 1;
            }
            else if (tx.type === "REDEMPTION") {
                redemptionsCount++;
            }
        }
        const redemptionRate = purchasesCount > 0 ? (redemptionsCount / purchasesCount) * 100 : 0;
        let visit1 = 0;
        let visit2 = 0;
        let visit3To5 = 0;
        let visit6Plus = 0;
        const totalCustomers = Object.keys(customerVisits).length;
        Object.values(customerVisits).forEach(count => {
            if (count === 1)
                visit1++;
            else if (count === 2)
                visit2++;
            else if (count >= 3 && count <= 5)
                visit3To5++;
            else if (count >= 6)
                visit6Plus++;
        });
        const calculatePercent = (val) => totalCustomers > 0 ? (val / totalCustomers) * 100 : 0;
        const customerReturnRate = {
            visit1Time: calculatePercent(visit1),
            visit2Times: calculatePercent(visit2),
            visit3To5Times: calculatePercent(visit3To5),
            visit6PlusTimes: calculatePercent(visit6Plus),
        };
        return {
            kpis: {
                totalSales,
                totalRewardRedeemed: redemptionsCount,
                redemptionRate,
                totalPointsIssued,
            },
            graph: {
                customerReturnRate
            }
        };
    },
    async getBrandsList() {
        return admin_repository_1.adminRepository.getBrandsWithStats();
    },
};
