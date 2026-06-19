import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AppError } from "../../common/errors/AppError";
import { env } from "../../config/env";

import { whatsappService } from "../whatsapp/whatsapp.service";
import { cashierRepository } from "./cashier.repository";
import { loyaltyRepository } from "../loyalty/loyalty.repository";
import { RewardMilestoneDto } from "../loyalty/loyalty.types";
import { string } from "zod";

const OTP_EXPIRY_MINUTES = 15;
const CASHIER_TOKEN_EXPIRY = "8h";

function validatePhoneNumber(phoneNumber: string): void {
  if (!/^\d{10}$/.test(phoneNumber)) {
    throw new AppError(
      "Invalid phone number. Must be 10 digits.",
      400
    );
  }
}

function generateOTP(): string {
  return crypto.randomInt(1000, 10000).toString();
}

export const cashierService = {
  async loginCashier(
    phoneNumber: string,
    password: string,
    outletId: string
  ): Promise<string> {
    if (!phoneNumber || !password || !outletId) {
      throw new AppError(
        "Phone, password, and outlet ID are required.",
        400
      );
    }

    const cashier =
      await cashierRepository.getCashierByPhoneAndOutlet(
        phoneNumber,
        outletId
      );

    if (!cashier) {
      throw new AppError("Invalid credentials.", 401);
    }

    if (!cashier.isActive) {
      throw new AppError(
        "Cashier account is deactivated.",
        403
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      cashier.passwordHash
    );

    if (!passwordMatch) {
      throw new AppError("Invalid credentials.", 401);
    }

    return jwt.sign(
      {
        cashierId: cashier.id,
        phoneNumber: cashier.phoneNumber,
        outletId: cashier.outletId,
        brandId: cashier.outlet.brandId,
        name: cashier.name,
      },
      env.jwtSecret,
      {
        expiresIn: CASHIER_TOKEN_EXPIRY,
      }
    );
  },

  async requestCustomerOTP(
    customerPhoneNumber: string,
    brandId: string
  ) {
    validatePhoneNumber(customerPhoneNumber);

    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await cashierRepository.createCustomerOTPSession(
      customerPhoneNumber,
      otp,
      expiresAt,
      brandId
    );

    await whatsappService.sendOTP(
      customerPhoneNumber,
      otp,
      brandId
    );

    return {
      expiresIn: OTP_EXPIRY_MINUTES * 60,
      message: "OTP sent to customer via WhatsApp",
    };
  },

  async verifyCustomerOTP(
    customerPhoneNumber: string,
    otp: string,
    brandId: string
  ) {
    if (!customerPhoneNumber || !otp || !brandId) {
      throw new AppError(
        "Phone, OTP, and brand ID are required.",
        400
      );
    }

    const session =
      await cashierRepository.getCustomerOTPSession(
        customerPhoneNumber,
        brandId
      );

    if (!session) {
      throw new AppError(
        "No active OTP session. Request a new OTP.",
        401
      );
    }

    if (new Date() > session.expiresAt) {
      throw new AppError("OTP has expired.", 401);
    }

    if (session.otp !== otp) {
      throw new AppError("Invalid OTP.", 401);
    }

    await cashierRepository.markCustomerOTPVerified(
      session.id
    );

    return {
      verified: true,
      message: "Customer OTP verified successfully",
    };
  },

  async getCustomerInfo(
    customerPhoneNumber: string,
    brandId: string
  ) {
    validatePhoneNumber(customerPhoneNumber);

    const { wallet, milestones } =
      await loyaltyRepository.getCustomerWalletWithMilestones(
        customerPhoneNumber,
        brandId
      );

    const isNew =
      await loyaltyRepository.isNewCustomer(
        customerPhoneNumber,
        brandId
      );

    const nextMilestone =
      milestones.find(
        (milestone: RewardMilestoneDto) =>
          milestone.coinsRequired > wallet.currentCoins
      ) ?? null;

    return {
      customerPhoneNumber,
      walletId: wallet.id,
      walletBalance: wallet.currentCoins,
      coinsExpiry: wallet.expiryDate,
      isNewCustomer: isNew,
      nextMilestone: nextMilestone
        ? {
            coinsRequired:
              nextMilestone.coinsRequired,
            cashbackAmount:
              nextMilestone.cashbackAmount,
            coinsNeeded:
              nextMilestone.coinsRequired -
              wallet.currentCoins,
          }
        : null,
      allMilestones: milestones,
    };
  },

  async processPurchase(
    customerPhoneNumber: string,
    brandId: string,
    outletId: string,
    purchaseAmount: number,
    cashierPhoneNumber: string
  ) {
    if (purchaseAmount <= 0) {
      throw new AppError(
        "Purchase amount must be greater than 0",
        400
      );
    }

    const settings =
      await loyaltyRepository.getBrandSettings(
        brandId
      );

    if (!settings) {
      throw new AppError(
        "Brand settings not found",
        500
      );
    }

    const brandName =
      await loyaltyRepository.getBrandName(
        brandId
      );

    if (!brandName) {
      throw new AppError(
        "Brand not found",
        500
      );
    }

    const coinsEarned = Math.floor(
      purchaseAmount * settings.coinRatioValue
    );

    const isNew =
      await loyaltyRepository.isNewCustomer(
        customerPhoneNumber,
        brandId
      );

    const { transaction, wallet } =
      await loyaltyRepository.recordPurchaseTransaction(
        customerPhoneNumber,
        brandId,
        outletId,
        purchaseAmount,
        coinsEarned,
        cashierPhoneNumber
      );

    try {
      await whatsappService.sendPurchaseNotification(
        customerPhoneNumber,
        brandName,
        coinsEarned,
        brandId,
        isNew
      );
    } catch (error) {
      console.error(
        "Failed to send WhatsApp notification:",
        error
      );
    }

    return {
      transactionId: transaction.id,
      outletId,
      coinsEarned,
      walletBalance: wallet.currentCoins,
      purchaseAmount,
      timestamp: transaction.createdAt,
    };
  },

  async processRedemption(
    customerPhoneNumber: string,
    brandId: string,
    outletId: string,
    milestoneId: string,
    purchaseAmount: number,
    cashierPhoneNumber: string
  ) {
    const isVerified =
      await cashierRepository.hasRecentVerifiedSession(
        customerPhoneNumber,
        brandId
      );

    if (!isVerified) {
      throw new AppError(
        "Customer OTP verification is required before redeeming rewards.",
        403
      );
    }

    const milestone =
      await loyaltyRepository.getRewardMilestoneById(
        milestoneId
      );

    if (!milestone) {
      throw new AppError(
        "Reward milestone not found",
        404
      );
    }

    const settings =
      await loyaltyRepository.getBrandSettings(
        brandId
      );

    if (!settings) {
      throw new AppError(
        "Brand settings not found",
        404
      );
    }

    const brandName =
      await loyaltyRepository.getBrandName(
        brandId
      );

    if (!brandName) {
      throw new AppError("Brand not found", 500);
    }

    const { wallet } =
      await loyaltyRepository.getCustomerWalletWithMilestones(
        customerPhoneNumber,
        brandId
      );

    if (
      wallet.currentCoins <
      milestone.coinsRequired
    ) {
      throw new AppError(
        `Insufficient coins. Need ${milestone.coinsRequired}, have ${wallet.currentCoins}`,
        400
      );
    }

    const coinsEarned = Math.floor(
      purchaseAmount * settings.coinRatioValue
    );

    const { redemptionTransaction, purchaseTransaction, wallet: finalWallet } = await loyaltyRepository.redeemAndPurchase(
      customerPhoneNumber,
      brandId,
      outletId,
      milestoneId,
      milestone.coinsRequired,
      milestone.cashbackAmount,
      purchaseAmount,
      coinsEarned,
      cashierPhoneNumber
    );

    try {
      await whatsappService.sendRedemptionNotification(
        customerPhoneNumber,
        brandName,
        milestone.coinsRequired,
        coinsEarned,
        finalWallet.currentCoins,
        brandId
      );
    } catch (error) {
      console.error(
        "Failed to send WhatsApp notification:",
        error
      );
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