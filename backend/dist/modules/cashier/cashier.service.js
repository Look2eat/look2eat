"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierService = exports.CashierService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../common/errors/AppError");
const whatsapp_service_1 = require("../../common/services/whatsapp.service");
const cashier_repository_1 = require("./cashier.repository");
/**
 * Cashier service layer
 * Handles business logic for cashier login, OTP, and customer operations
 */
class CashierService {
    constructor() {
        this.OTP_EXPIRY_MINUTES = 15;
        this.OTP_LENGTH = 6;
    }
    /**
     * Generate a random 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    /**
     * Request OTP for cashier login
     * Generates OTP, saves to database, sends via WhatsApp
     */
    async requestOTP(phoneNumber, outletId, brandId) {
        // Validate phone format
        if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            throw new AppError_1.AppError('Invalid phone number. Must be 10 digits.', 400);
        }
        // Get cashier by phone and outlet
        const cashier = await cashier_repository_1.cashierRepository.getCashierByPhoneAndOutlet(phoneNumber, outletId);
        if (!cashier) {
            throw new AppError_1.AppError('Cashier not found. Check phone number.', 404);
        }
        if (!cashier.isActive) {
            throw new AppError_1.AppError('Cashier account is deactivated.', 403);
        }
        // Validate brand matches cashier's outlet
        if (cashier.outlet.brandId !== brandId) {
            throw new AppError_1.AppError('Cashier does not belong to this brand.', 403);
        }
        // Generate OTP
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
        // Save OTP to database
        const session = await cashier_repository_1.cashierRepository.createCashierSession(cashier.id, otp, expiresAt);
        // Send OTP via WhatsApp to cashier
        await whatsapp_service_1.whatsappService.sendOTP(phoneNumber, otp, brandId);
        return {
            sessionId: session.id,
            expiresIn: this.OTP_EXPIRY_MINUTES * 60, // seconds
        };
    }
    /**
     * Verify OTP and create JWT session for cashier
     */
    async verifyOTP(phoneNumber, otp, outletId, brandId) {
        // Validate inputs
        if (!phoneNumber || !otp) {
            throw new AppError_1.AppError('Phone and OTP are required.', 400);
        }
        // Get cashier
        const cashier = await cashier_repository_1.cashierRepository.getCashierByPhoneAndOutlet(phoneNumber, outletId);
        if (!cashier) {
            throw new AppError_1.AppError('Cashier not found.', 404);
        }
        // Validate brand
        if (cashier.outlet.brandId !== brandId) {
            throw new AppError_1.AppError('Cashier does not belong to this brand.', 403);
        }
        // Get active session with OTP
        const session = await cashier_repository_1.cashierRepository.getCashierSessionByPhone(phoneNumber, outletId);
        if (!session) {
            throw new AppError_1.AppError('No active OTP session. Request a new OTP.', 401);
        }
        // Verify OTP matches
        if (session.otp !== otp) {
            throw new AppError_1.AppError('Invalid OTP.', 401);
        }
        // Mark session as verified
        await cashier_repository_1.cashierRepository.updateCashierSessionVerified(session.id, new Date());
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({
            cashierId: cashier.id,
            phoneNumber: cashier.phoneNumber,
            outletId: cashier.outletId,
            brandId: cashier.outlet.brandId,
            name: cashier.name,
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '8h' });
        return token;
    }
    /**
     * Get customer wallet and milestone information
     */
    async getCustomerInfo(customerPhoneNumber, brandId) {
        if (!customerPhoneNumber || customerPhoneNumber.length !== 10 || !/^\d+$/.test(customerPhoneNumber)) {
            throw new AppError_1.AppError('Invalid customer phone number. Must be 10 digits.', 400);
        }
        const { wallet, milestones } = await cashier_repository_1.cashierRepository.getCustomerWalletWithMilestones(customerPhoneNumber, brandId);
        const isNew = await cashier_repository_1.cashierRepository.isNewCustomer(customerPhoneNumber, brandId);
        // Calculate next milestone
        const nextMilestone = milestones.find((m) => m.coinsRequired > wallet.currentCoins) || null;
        return {
            customerPhoneNumber,
            walletBalance: wallet.currentCoins,
            coinsExpiry: wallet.expiryDate,
            isNewCustomer: isNew,
            nextMilestone: nextMilestone ? {
                coinsRequired: nextMilestone.coinsRequired,
                cashbackAmount: nextMilestone.cashbackAmount,
                coinsNeeded: nextMilestone.coinsRequired - wallet.currentCoins,
            } : null,
            allMilestones: milestones,
        };
    }
    /**
     * Process a purchase transaction
     * Calculates coins earned based on coin ratio
     */
    async processPurchase(customerPhoneNumber, brandId, purchaseAmount, cashierPhoneNumber) {
        // Validate inputs
        if (purchaseAmount <= 0) {
            throw new AppError_1.AppError('Purchase amount must be greater than 0', 400);
        }
        // Get brand settings for coin ratio
        const settings = await cashier_repository_1.cashierRepository.getBrandSettings(brandId);
        if (!settings) {
            throw new AppError_1.AppError('Brand settings not found', 500);
        }
        // Get brand name for WhatsApp notification
        const brandName = await cashier_repository_1.cashierRepository.getBrandName(brandId);
        if (!brandName) {
            throw new AppError_1.AppError('Brand not found', 500);
        }
        // Calculate coins earned
        const coinsEarned = Math.floor(purchaseAmount * settings.coinRatioValue);
        // Record transaction
        const { transaction, wallet } = await cashier_repository_1.cashierRepository.recordPurchaseTransaction(customerPhoneNumber, brandId, purchaseAmount, coinsEarned, cashierPhoneNumber);
        // Determine if this is a new (first purchase) customer
        const isNew = await cashier_repository_1.cashierRepository.isNewCustomer(customerPhoneNumber, brandId);
        // Send WhatsApp notification
        try {
            await whatsapp_service_1.whatsappService.sendPurchaseNotification(customerPhoneNumber, brandName, coinsEarned, brandId, isNew);
        }
        catch (error) {
            // Log but don't fail - transaction was recorded
            console.error('Failed to send WhatsApp notification:', error);
        }
        return {
            transactionId: transaction.id,
            coinsEarned,
            walletBalance: wallet.currentCoins,
            purchaseAmount,
            timestamp: transaction.createdAt,
        };
    }
    /**
     * Process a redemption (coin cashback conversion)
     */
    async processRedemption(customerPhoneNumber, brandId, milestoneId, cashierPhoneNumber) {
        // Get milestone details
        const milestone = await cashier_repository_1.cashierRepository.getRewardMilestoneById(milestoneId);
        if (!milestone) {
            throw new AppError_1.AppError('Reward milestone not found', 404);
        }
        // Get brand name for WhatsApp notification
        const brandName = await cashier_repository_1.cashierRepository.getBrandName(brandId);
        if (!brandName) {
            throw new AppError_1.AppError('Brand not found', 500);
        }
        // Get wallet
        const { wallet } = await cashier_repository_1.cashierRepository.getCustomerWalletWithMilestones(customerPhoneNumber, brandId);
        // Check if customer has enough coins
        if (wallet.currentCoins < milestone.coinsRequired) {
            throw new AppError_1.AppError(`Insufficient coins. Need ${milestone.coinsRequired}, have ${wallet.currentCoins}`, 400);
        }
        // Calculate remaining coins after redemption for purchase credit
        const remainingCoinsForPurchase = wallet.currentCoins - milestone.coinsRequired;
        // Record redemption
        const { transaction, wallet: updatedWallet } = await cashier_repository_1.cashierRepository.recordRedemptionTransaction(customerPhoneNumber, brandId, milestone.coinsRequired, milestone.cashbackAmount, milestoneId, cashierPhoneNumber);
        // Send WhatsApp notification with detailed redemption info
        try {
            await whatsapp_service_1.whatsappService.sendRedemptionNotification(customerPhoneNumber, brandName, milestone.coinsRequired, // coinsRedeemed
            0, // earnedCoins (no new coins from this redemption)
            updatedWallet.currentCoins, // totalCoinsAfter
            brandId);
        }
        catch (error) {
            console.error('Failed to send WhatsApp notification:', error);
        }
        return {
            transactionId: transaction.id,
            coinsRedeemed: milestone.coinsRequired,
            cashbackApplied: milestone.cashbackAmount,
            remainingCoins: updatedWallet.currentCoins,
            timestamp: transaction.createdAt,
        };
    }
}
exports.CashierService = CashierService;
exports.cashierService = new CashierService();
