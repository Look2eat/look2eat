"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../common/errors/AppError");
const env_1 = require("../../config/env");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const cashier_repository_1 = require("./cashier.repository");
const loyalty_repository_1 = require("../loyalty/loyalty.repository");
const OTP_EXPIRY_MINUTES = 15;
const CASHIER_TOKEN_EXPIRY = "8h";
function validatePhoneNumber(phoneNumber) {
    if (!/^\d{10}$/.test(phoneNumber)) {
        throw new AppError_1.AppError("Invalid phone number. Must be 10 digits.", 400);
    }
}
function generateOTP() {
    return crypto_1.default.randomInt(1000, 10000).toString();
}
exports.cashierService = {
    async loginCashier(phoneNumber, password, outletId) {
        if (!phoneNumber || !password || !outletId) {
            throw new AppError_1.AppError("Phone, password, and outlet ID are required.", 400);
        }
        const cashier = await cashier_repository_1.cashierRepository.getCashierByPhoneAndOutlet(phoneNumber, outletId);
        if (!cashier) {
            throw new AppError_1.AppError("Invalid credentials.", 401);
        }
        if (!cashier.isActive) {
            throw new AppError_1.AppError("Cashier account is deactivated.", 403);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, cashier.passwordHash);
        if (!passwordMatch) {
            throw new AppError_1.AppError("Invalid credentials.", 401);
        }
        return jsonwebtoken_1.default.sign({
            cashierId: cashier.id,
            phoneNumber: cashier.phoneNumber,
            outletId: cashier.outletId,
            brandId: cashier.outlet.brandId,
            name: cashier.name,
        }, env_1.env.jwtSecret, {
            expiresIn: CASHIER_TOKEN_EXPIRY,
        });
    },
    async requestCustomerOTP(customerPhoneNumber, brandId) {
        validatePhoneNumber(customerPhoneNumber);
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await cashier_repository_1.cashierRepository.createCustomerOTPSession(customerPhoneNumber, otp, expiresAt, brandId);
        await whatsapp_service_1.whatsappService.sendOTP(customerPhoneNumber, otp, brandId);
        return {
            expiresIn: OTP_EXPIRY_MINUTES * 60,
            message: "OTP sent to customer via WhatsApp",
        };
    },
    async verifyCustomerOTP(customerPhoneNumber, otp, brandId) {
        if (!customerPhoneNumber || !otp || !brandId) {
            throw new AppError_1.AppError("Phone, OTP, and brand ID are required.", 400);
        }
        const session = await cashier_repository_1.cashierRepository.getCustomerOTPSession(customerPhoneNumber, brandId);
        if (!session) {
            throw new AppError_1.AppError("No active OTP session. Request a new OTP.", 401);
        }
        if (new Date() > session.expiresAt) {
            throw new AppError_1.AppError("OTP has expired.", 401);
        }
        if (session.otp !== otp) {
            throw new AppError_1.AppError("Invalid OTP.", 401);
        }
        await cashier_repository_1.cashierRepository.markCustomerOTPVerified(session.id);
        return {
            verified: true,
            message: "Customer OTP verified successfully",
        };
    },
    async getCustomerInfo(customerPhoneNumber, brandId) {
        validatePhoneNumber(customerPhoneNumber);
        const { wallet, milestones } = await loyalty_repository_1.loyaltyRepository.getCustomerWalletWithMilestones(customerPhoneNumber, brandId);
        const isNew = await loyalty_repository_1.loyaltyRepository.isNewCustomer(customerPhoneNumber, brandId);
        const nextMilestone = milestones.find((milestone) => milestone.coinsRequired > wallet.currentCoins) ?? null;
        return {
            customerPhoneNumber,
            walletId: wallet.id,
            walletBalance: wallet.currentCoins,
            coinsExpiry: wallet.expiryDate,
            isNewCustomer: isNew,
            nextMilestone: nextMilestone
                ? {
                    coinsRequired: nextMilestone.coinsRequired,
                    cashbackAmount: nextMilestone.cashbackAmount,
                    coinsNeeded: nextMilestone.coinsRequired -
                        wallet.currentCoins,
                }
                : null,
            allMilestones: milestones,
        };
    },
    async processPurchase(customerPhoneNumber, brandId, purchaseAmount, cashierPhoneNumber) {
        if (purchaseAmount <= 0) {
            throw new AppError_1.AppError("Purchase amount must be greater than 0", 400);
        }
        const settings = await loyalty_repository_1.loyaltyRepository.getBrandSettings(brandId);
        if (!settings) {
            throw new AppError_1.AppError("Brand settings not found", 500);
        }
        const brandName = await loyalty_repository_1.loyaltyRepository.getBrandName(brandId);
        if (!brandName) {
            throw new AppError_1.AppError("Brand not found", 500);
        }
        const coinsEarned = Math.floor(purchaseAmount * settings.coinRatioValue);
        const isNew = await loyalty_repository_1.loyaltyRepository.isNewCustomer(customerPhoneNumber, brandId);
        const { transaction, wallet } = await loyalty_repository_1.loyaltyRepository.recordPurchaseTransaction(customerPhoneNumber, brandId, purchaseAmount, coinsEarned, cashierPhoneNumber);
        try {
            await whatsapp_service_1.whatsappService.sendPurchaseNotification(customerPhoneNumber, brandName, coinsEarned, brandId, isNew);
        }
        catch (error) {
            console.error("Failed to send WhatsApp notification:", error);
        }
        return {
            transactionId: transaction.id,
            coinsEarned,
            walletBalance: wallet.currentCoins,
            purchaseAmount,
            timestamp: transaction.createdAt,
        };
    },
    async processRedemption(customerPhoneNumber, brandId, milestoneId, purchaseAmount, cashierPhoneNumber) {
        const isVerified = await cashier_repository_1.cashierRepository.hasRecentVerifiedSession(customerPhoneNumber, brandId);
        if (!isVerified) {
            throw new AppError_1.AppError("Customer OTP verification is required before redeeming rewards.", 403);
        }
        const milestone = await loyalty_repository_1.loyaltyRepository.getRewardMilestoneById(milestoneId);
        if (!milestone) {
            throw new AppError_1.AppError("Reward milestone not found", 404);
        }
        const settings = await loyalty_repository_1.loyaltyRepository.getBrandSettings(brandId);
        if (!settings) {
            throw new AppError_1.AppError("Brand settings not found", 404);
        }
        const brandName = await loyalty_repository_1.loyaltyRepository.getBrandName(brandId);
        if (!brandName) {
            throw new AppError_1.AppError("Brand not found", 500);
        }
        const { wallet } = await loyalty_repository_1.loyaltyRepository.getCustomerWalletWithMilestones(customerPhoneNumber, brandId);
        if (wallet.currentCoins <
            milestone.coinsRequired) {
            throw new AppError_1.AppError(`Insufficient coins. Need ${milestone.coinsRequired}, have ${wallet.currentCoins}`, 400);
        }
        const coinsEarned = Math.floor(purchaseAmount * settings.coinRatioValue);
        const { redemptionTransaction, purchaseTransaction, wallet: finalWallet } = await loyalty_repository_1.loyaltyRepository.redeemAndPurchase(customerPhoneNumber, brandId, milestoneId, milestone.coinsRequired, milestone.cashbackAmount, purchaseAmount, coinsEarned, cashierPhoneNumber);
        try {
            await whatsapp_service_1.whatsappService.sendRedemptionNotification(customerPhoneNumber, brandName, milestone.coinsRequired, coinsEarned, finalWallet.currentCoins, brandId);
        }
        catch (error) {
            console.error("Failed to send WhatsApp notification:", error);
        }
        return {
            redemptionTransactionId: redemptionTransaction.id,
            purchaseTransactionId: purchaseTransaction.id,
            coinsRedeemed: milestone.coinsRequired,
            cashbackApplied: milestone.cashbackAmount,
            purchaseAmount,
            coinsEarned,
            remainingCoins: finalWallet.currentCoins,
            timestamp: redemptionTransaction.createdAt,
        };
    },
};
