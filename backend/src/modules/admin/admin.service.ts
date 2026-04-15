import { adminRepository } from "./admin.repository";
import { AppError } from "../../common/errors/AppError";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const adminService = {

  async setBrandCoinRatio(brandId: string, coinRatioValue: number) {
    if (coinRatioValue <= 0) {
      throw new AppError("Coin ratio must be greater than 0", 400);
    }

    const existing = await adminRepository.getBrandSettings(brandId);
    if (existing) {
      return adminRepository.updateBrandSettings(brandId, coinRatioValue);
    }

    return adminRepository.createBrandSettings(brandId, coinRatioValue);
  },

  async getBrandCoinRatio(brandId: string) {
    const settings = await adminRepository.getBrandSettings(brandId);
    if (!settings) {
      throw new AppError("Brand settings not found", 404);
    }
    return settings;
  },

  async createCashier(
    outletId: string,
    phoneNumber: string,
    name: string
  ) {

    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new AppError(
        "Phone number must be 10 digits without country code",
        400
      );
    }

    const existing = await adminRepository.getCashierByPhone(
      outletId,
      phoneNumber
    );
    if (existing) {
      throw new AppError("Cashier with this phone number already exists", 409);
    }

    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();

    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const cashier = await adminRepository.createCashier(
      outletId,
      phoneNumber,
      name,
      passwordHash
    );

    return {
      id: cashier.id,
      phoneNumber: cashier.phoneNumber,
      name: cashier.name,
      tempPassword, 
    };
  },

  async getCashiersByOutlet(outletId: string) {
    return adminRepository.getCashiersByOutlet(outletId);
  },

  async deactivateCashier(cashierId: string) {
    return adminRepository.updateCashierStatus(cashierId, false);
  },

  async reactivateCashier(cashierId: string) {
    return adminRepository.updateCashierStatus(cashierId, true);
  },

  async createRewardMilestone(
    brandId: string,
    name: string,
    coinsRequired: number,
    cashbackAmount: number
  ) {
    if (coinsRequired <= 0 || cashbackAmount <= 0) {
      throw new AppError("Coins and cashback must be greater than 0", 400);
    }

    const milestones = await adminRepository.getRewardMilestonesByBrand(
      brandId
    );
    if (milestones.some((m: any) => m.coinsRequired === coinsRequired)) {
      throw new AppError(
        `Milestone for ${coinsRequired} coins already exists`,
        409
      );
    }

    return adminRepository.createRewardMilestone(
      brandId,
      name,
      coinsRequired,
      cashbackAmount
    );
  },

  async getRewardMilestones(brandId: string) {
    return adminRepository.getRewardMilestonesByBrand(brandId);
  },

  async updateRewardMilestone(
    milestoneId: string,
    coinsRequired?: number,
    cashbackAmount?: number
  ) {
    if (
      (coinsRequired !== undefined && coinsRequired <= 0) ||
      (cashbackAmount !== undefined && cashbackAmount <= 0)
    ) {
      throw new AppError("Coins and cashback must be greater than 0", 400);
    }

    return adminRepository.updateRewardMilestone(
      milestoneId,
      coinsRequired,
      cashbackAmount
    );
  },

  async getTransactionHistory(
    brandId: string,
    limit: number = 50,
    offset: number = 0,
    filters?: {
      customerPhone?: string;
      type?: "PURCHASE" | "REDEMPTION";
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    let transactions: any[];

    if (filters?.customerPhone) {
      transactions = await adminRepository.getTransactionsByCustomerPhone(
        brandId,
        filters.customerPhone
      );
    } else if (filters?.startDate && filters?.endDate) {
      transactions = await adminRepository.getTransactionsByDateRange(
        brandId,
        filters.startDate,
        filters.endDate
      );
    } else {
      transactions = await adminRepository.getTransactionsByBrandId(
        brandId,
        limit,
        offset
      );
    }

    if (filters?.type) {
      transactions = transactions.filter((t: any) => t.type === filters.type);
    }

    return transactions;
  },

  async getTransactionStats(brandId: string) {
    const allTransactions = await adminRepository.getTransactionsByBrandId(
      brandId,
      999999,
      0
    );

    const totalTransactions = allTransactions.length;
    const totalPurchases = allTransactions.filter(
      (t: any) => t.type === "PURCHASE"
    ).length;
    const totalRedemptions = allTransactions.filter(
      (t: any) => t.type === "REDEMPTION"
    ).length;

    const totalCoinsEarned = allTransactions.reduce(
      (sum: number, t: any) => sum + (t.coinsEarned || 0),
      0
    );
    const totalCoinsRedeemed = allTransactions.reduce(
      (sum: number, t: any) => sum + (t.coinsRedeemed || 0),
      0
    );
    const totalCashbackGiven = allTransactions.reduce(
      (sum: number, t: any) => sum + (t.cashbackApplied || 0),
      0
    );

    return {
      totalTransactions,
      totalPurchases,
      totalRedemptions,
      totalCoinsEarned,
      totalCoinsRedeemed,
      totalCashbackGiven,
    };
  },

  async getDashboardData(brandId: string) {
    const allTransactions = await adminRepository.getTransactionsByBrandId(
      brandId,
      999999,
      0
    );

    let totalSales = 0;
    let totalPointsIssued = 0;
    let purchasesCount = 0;
    let redemptionsCount = 0;

    const customerVisits: Record<string, number> = {};

    for (const tx of allTransactions) {
      if (tx.type === "PURCHASE") {
        totalSales += (tx.purchaseAmount || 0);
        totalPointsIssued += (tx.coinsEarned || 0);
        purchasesCount++;

        const customerIdentifier = tx.walletId || "unknown";
        customerVisits[customerIdentifier] = (customerVisits[customerIdentifier] || 0) + 1;
      } else if (tx.type === "REDEMPTION") {
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
      if (count === 1) visit1++;
      else if (count === 2) visit2++;
      else if (count >= 3 && count <= 5) visit3To5++;
      else if (count >= 6) visit6Plus++;
    });

    const calculatePercent = (val: number) => totalCustomers > 0 ? (val / totalCustomers) * 100 : 0;

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
    return adminRepository.getBrandsWithStats();
  },
};
