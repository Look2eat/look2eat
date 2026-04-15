"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierRepository = exports.CashierRepository = void 0;
const client_1 = require("../../prisma/client");
/**
 * Cashier data access layer
 * Handles all database operations for cashier login, sessions, and customer lookups
 */
class CashierRepository {
    /**
     * Create a new cashier session with OTP
     */
    async createCashierSession(cashierId, otp, expiresAt) {
        return client_1.prisma.cashierSession.create({
            data: {
                cashierId,
                otp,
                otpExpiresAt: expiresAt,
            },
        });
    }
    /**
     * Get active cashier session by phone (for OTP verification)
     */
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
        // Get the most recent active session (OTP not expired)
        return client_1.prisma.cashierSession.findFirst({
            where: {
                cashierId: cashier.id,
                otpExpiresAt: {
                    gt: new Date(), // OTP still valid
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    /**
     * Mark cashier session as verified
     */
    async updateCashierSessionVerified(sessionId, verifiedAt) {
        return client_1.prisma.cashierSession.update({
            where: { id: sessionId },
            data: {
                verifiedAt,
            },
        });
    }
    /**
     * Get cashier by phone and outlet for login
     */
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
                    include: {
                        brand: {
                            include: {
                                settings: true,
                            },
                        },
                    },
                },
            },
        });
    }
    /**
     * Get or create customer wallet for given phone and brand
     */
    async getOrCreateCoinWallet(customerPhoneNumber, brandId) {
        // Try to find existing wallet
        let wallet = await client_1.prisma.coinWallet.findFirst({
            where: {
                phoneNumber: customerPhoneNumber,
                brandId,
            },
        });
        // Create if doesn't exist
        if (!wallet) {
            wallet = await client_1.prisma.coinWallet.create({
                data: {
                    phoneNumber: customerPhoneNumber,
                    brandId,
                    currentCoins: 0,
                    expiryDate: new Date('2026-04-19T17:00:00Z'), // Pilot expires April 19, 5 PM
                },
            });
        }
        return wallet;
    }
    /**
     * Get customer wallet with reward milestones
     */
    async getCustomerWalletWithMilestones(customerPhoneNumber, brandId) {
        const wallet = await this.getOrCreateCoinWallet(customerPhoneNumber, brandId);
        const milestones = await client_1.prisma.rewardMilestone.findMany({
            where: { brandId },
            orderBy: { coinsRequired: 'asc' },
        });
        return {
            wallet,
            milestones,
        };
    }
    /**
     * Check if customer is new (has no transactions)
     */
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
    }
    /**
     * Record a purchase transaction and update wallet balance
     */
    async recordPurchaseTransaction(customerPhoneNumber, brandId, purchaseAmount, coinsEarned, cashierPhoneNumber) {
        // Get or create wallet
        const wallet = await this.getOrCreateCoinWallet(customerPhoneNumber, brandId);
        // Create transaction
        const transaction = await client_1.prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: 'PURCHASE',
                purchaseAmount,
                coinsEarned,
                cashierPhoneNumber,
            },
        });
        // Update wallet balance
        const updatedWallet = await client_1.prisma.coinWallet.update({
            where: { id: wallet.id },
            data: {
                currentCoins: {
                    increment: coinsEarned,
                },
            },
        });
        return { transaction, wallet: updatedWallet };
    }
    /**
     * Record a redemption transaction and update wallet balance
     */
    async recordRedemptionTransaction(customerPhoneNumber, brandId, coinsRedeemed, cashbackApplied, milestoneId, cashierPhoneNumber) {
        // Get wallet
        const wallet = await client_1.prisma.coinWallet.findFirst({
            where: {
                phoneNumber: customerPhoneNumber,
                brandId,
            },
        });
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        // Create redemption transaction
        const transaction = await client_1.prisma.transaction.create({
            data: {
                walletId: wallet.id,
                type: 'REDEMPTION',
                coinsRedeemed,
                cashbackApplied,
                milestoneId,
                cashierPhoneNumber,
            },
        });
        // Update wallet balance (deduct coins used)
        const updatedWallet = await client_1.prisma.coinWallet.update({
            where: { id: wallet.id },
            data: {
                currentCoins: {
                    decrement: coinsRedeemed,
                },
            },
        });
        return { transaction, wallet: updatedWallet };
    }
    /**
     * Get brand settings for coin ratio calculation
     */
    async getBrandSettings(brandId) {
        return client_1.prisma.brandSettings.findUnique({
            where: { brandId },
        });
    }
    /**
     * Get reward milestone by ID
     */
    async getRewardMilestoneById(milestoneId) {
        return client_1.prisma.rewardMilestone.findUnique({
            where: { id: milestoneId },
        });
    }
    /**
     * Get brand name by ID
     */
    async getBrandName(brandId) {
        const brand = await client_1.prisma.brand.findUnique({
            where: { id: brandId },
            select: { name: true },
        });
        return brand?.name || null;
    }
}
exports.CashierRepository = CashierRepository;
exports.cashierRepository = new CashierRepository();
