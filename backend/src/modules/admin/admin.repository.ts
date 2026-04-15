import { prisma } from "../../prisma/client";

export const adminRepository = {

  async getBrandSettings(brandId: string) {
    return prisma.brandSettings.findUnique({
      where: { brandId },
    });
  },

  async createBrandSettings(brandId: string, coinRatioValue: number) {
    return prisma.brandSettings.create({
      data: {
        brandId,
        coinRatioValue,
        pilotStartDate: new Date("2026-04-17"),
        pilotEndDate: new Date("2026-04-19T17:00:00"), 
      },
    });
  },

  async updateBrandSettings(
    brandId: string,
    coinRatioValue: number
  ) {
    return prisma.brandSettings.update({
      where: { brandId },
      data: { coinRatioValue },
    });
  },

  async createCashier(
    outletId: string,
    phoneNumber: string,
    name: string,
    passwordHash: string
  ) {
    return prisma.cashier.create({
      data: {
        outletId,
        phoneNumber,
        name,
        passwordHash,
      },
    });
  },

  async getCashierByPhone(outletId: string, phoneNumber: string) {
    return prisma.cashier.findUnique({
      where: {
        outletId_phoneNumber: { outletId, phoneNumber },
      },
    });
  },

  async getCashiersByOutlet(outletId: string) {
    return prisma.cashier.findMany({
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

  async updateCashierStatus(cashierId: string, isActive: boolean) {
    return prisma.cashier.update({
      where: { id: cashierId },
      data: { isActive },
    });
  },

  async createRewardMilestone(
    brandId: string,
    name: string,
    coinsRequired: number,
    cashbackAmount: number
  ) {
    return prisma.rewardMilestone.create({
      data: {
        brandId,
        name,
        coinsRequired,
        cashbackAmount,
      },
    });
  },

  async getRewardMilestonesByBrand(brandId: string) {
    return prisma.rewardMilestone.findMany({
      where: { brandId, isActive: true },
      orderBy: { coinsRequired: "asc" },
    });
  },

  async updateRewardMilestone(
    milestoneId: string,
    coinsRequired?: number,
    cashbackAmount?: number
  ) {
    return prisma.rewardMilestone.update({
      where: { id: milestoneId },
      data: {
        ...(coinsRequired && { coinsRequired }),
        ...(cashbackAmount && { cashbackAmount }),
      },
    });
  },

  async getTransactionsByBrandId(
    brandId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return prisma.transaction.findMany({
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

  async getTransactionCount(brandId: string) {
    return prisma.transaction.count({
      where: {
        wallet: {
          brandId,
        },
      },
    });
  },

  async getTransactionsByDateRange(
    brandId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.transaction.findMany({
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

  async getTransactionsByCustomerPhone(brandId: string, phoneNumber: string) {
    return prisma.transaction.findMany({
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
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        outlets: true,
        settings: true,
      },
    });

    const brandsWithStats = await Promise.all(
      brands.map(async (brand: any) => {
        const transactionCount = await prisma.transaction.count({
          where: {
            wallet: {
              brandId: brand.id,
            },
          },
        });

        const walletCount = await prisma.coinWallet.count({
          where: {
            brandId: brand.id,
          },
        });

        return {
          ...brand,
          transactionCount,
          walletCount,
        };
      })
    );

    return brandsWithStats;
  },
};
