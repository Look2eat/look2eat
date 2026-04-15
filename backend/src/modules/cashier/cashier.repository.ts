import { prisma } from '../../prisma/client';

export class CashierRepository {

  async createCashierSession(cashierId: string, otp: string, expiresAt: Date) {
    return prisma.cashierSession.create({
      data: {
        cashierId,
        otp,
        otpExpiresAt: expiresAt,
      },
    });
  }

  async getCashierSessionByPhone(cashierPhoneNumber: string, outletId: string) {
    const cashier = await prisma.cashier.findUnique({
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

    return prisma.cashierSession.findFirst({
      where: {
        cashierId: cashier.id,
        otpExpiresAt: {
          gt: new Date(), 
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateCashierSessionVerified(sessionId: string, verifiedAt: Date) {
    return prisma.cashierSession.update({
      where: { id: sessionId },
      data: {
        verifiedAt,
      },
    });
  }

  async getCashierByPhoneAndOutlet(phoneNumber: string, outletId: string) {
    return prisma.cashier.findUnique({
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

  async getOrCreateCoinWallet(customerPhoneNumber: string, brandId: string) {

    let wallet = await prisma.coinWallet.findFirst({
      where: {
        phoneNumber: customerPhoneNumber,
        brandId,
      },
    });

    if (!wallet) {
      wallet = await prisma.coinWallet.create({
        data: {
          phoneNumber: customerPhoneNumber,
          brandId,
          currentCoins: 0,
          expiryDate: new Date('2026-04-20T23:59:59Z'), 
        },
      });
    }

    return wallet;
  }

  async getCustomerWalletWithMilestones(customerPhoneNumber: string, brandId: string) {
    const wallet = await this.getOrCreateCoinWallet(customerPhoneNumber, brandId);

    const milestones = await prisma.rewardMilestone.findMany({
      where: { brandId },
      orderBy: { coinsRequired: 'asc' },
    });

    return {
      wallet,
      milestones,
    };
  }

  async isNewCustomer(customerPhoneNumber: string, brandId: string): Promise<boolean> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        wallet: {
          phoneNumber: customerPhoneNumber,
          brandId,
        },
      },
    });

    return !transaction;
  }

  async recordPurchaseTransaction(
    customerPhoneNumber: string,
    brandId: string,
    purchaseAmount: number,
    coinsEarned: number,
    cashierPhoneNumber: string
  ) {

    const wallet = await this.getOrCreateCoinWallet(customerPhoneNumber, brandId);

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'PURCHASE',
        purchaseAmount,
        coinsEarned,
        cashierPhoneNumber,
      },
    });

    const updatedWallet = await prisma.coinWallet.update({
      where: { id: wallet.id },
      data: {
        currentCoins: {
          increment: coinsEarned,
        },
      },
    });

    return { transaction, wallet: updatedWallet };
  }

  async recordRedemptionTransaction(
    customerPhoneNumber: string,
    brandId: string,
    coinsRedeemed: number,
    cashbackApplied: number,
    milestoneId: string,
    cashierPhoneNumber: string
  ) {

    const wallet = await prisma.coinWallet.findFirst({
      where: {
        phoneNumber: customerPhoneNumber,
        brandId,
      },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'REDEMPTION',
        coinsRedeemed,
        cashbackApplied,
        milestoneId,
        cashierPhoneNumber,
      },
    });

    const updatedWallet = await prisma.coinWallet.update({
      where: { id: wallet.id },
      data: {
        currentCoins: {
          decrement: coinsRedeemed,
        },
      },
    });

    return { transaction, wallet: updatedWallet };
  }

  async getBrandSettings(brandId: string) {
    return prisma.brandSettings.findUnique({
      where: { brandId },
    });
  }

  async getRewardMilestoneById(milestoneId: string) {
    return prisma.rewardMilestone.findUnique({
      where: { id: milestoneId },
    });
  }

  async getBrandName(brandId: string): Promise<string | null> {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { name: true },
    });
    return brand?.name || null;
  }

  async createCustomerOTPSession(
    customerPhoneNumber: string,
    otp: string,
    expiresAt: Date,
    brandId: string
  ) {
    return prisma.customerOTPSession.create({
      data: {
        phoneNumber: customerPhoneNumber,
        otp,
        expiresAt,
        brandId,
        verified: false,
      },
    });
  }

  async getCustomerOTPSession(customerPhoneNumber: string, brandId: string) {
    return prisma.customerOTPSession.findFirst({
      where: {
        phoneNumber: customerPhoneNumber,
        brandId,
        verified: false,
        expiresAt: {
          gt: new Date(), 
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }

  async markCustomerOTPVerified(sessionId: string) {
    return prisma.customerOTPSession.update({
      where: { id: sessionId },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });
  }

  async hasRecentVerifiedSession(customerPhoneNumber: string, brandId: string): Promise<boolean> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const session = await prisma.customerOTPSession.findFirst({
      where: {
        phoneNumber: customerPhoneNumber,
        brandId,
        verified: true,
        verifiedAt: {
          gte: fifteenMinutesAgo,
        },
      },
    });
    return !!session;
  }
}

export const cashierRepository = new CashierRepository();

