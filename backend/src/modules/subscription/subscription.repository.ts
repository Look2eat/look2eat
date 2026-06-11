import { prisma } from "../../prisma/client";
import { CreditTransactionType } from "@prisma/client";

export const subscriptionRepository = {
  async createPlan(
    name: string,
    durationMonths: number,
    price: number
  ) {
    return prisma.subscriptionPlan.create({
      data: {
        name,
        durationMonths,
        price,
      },
    });
  },

  async getPlans() {
    return prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });
  },

  async getPlanById(planId: string) {
    return prisma.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });
  },

  async createSubscription(
    outletId: string,
    planId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.outletSubscription.create({
      data: {
        outletId,
        planId,
        startDate,
        endDate,
      },
      include: {
        plan: true,
      },
    });
  },

  async getActiveSubscription(outletId: string) {
    return prisma.outletSubscription.findFirst({
      where: {
        outletId,
        isActive: true,
        endDate: {
          gt: new Date(),
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        endDate: "desc",
      },
    });
  },

  async deactivateSubscriptions(outletId: string) {
    return prisma.outletSubscription.updateMany({
      where: {
        outletId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  },

  async getCreditWallet(outletId: string) {
    return prisma.platformCreditWallet.findUnique({
      where: {
        outletId,
      },
    });
  },

  async createCreditWallet(outletId: string) {
    return prisma.platformCreditWallet.create({
      data: {
        outletId,
      },
    });
  },

  async incrementCredits(
    outletId: string,
    credits: number
  ) {
    return prisma.platformCreditWallet.update({
      where: {
        outletId,
      },
      data: {
        balance: {
          increment: credits,
        },
        totalPurchased: {
          increment: credits,
        },
      },
    });
  },

  async decrementCredits(
    outletId: string,
    credits: number
  ) {
    return prisma.platformCreditWallet.update({
      where: {
        outletId,
      },
      data: {
        balance: {
          decrement: credits,
        },
        totalConsumed: {
          increment: credits,
        },
      },
    });
  },

  async createCreditTransaction(
    outletId: string,
    type: CreditTransactionType,
    credits: number,
    amountPaid?: number,
    description?: string
  ) {
    return prisma.creditTransaction.create({
      data: {
        outletId,
        type,
        credits,
        amountPaid,
        description,
      },
    });
  },
};