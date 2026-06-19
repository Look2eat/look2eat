import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";

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

  async getPlanById(
    planId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.subscriptionPlan.findUnique({
      where: {
        id: planId,
      },
    });
  },

  async createSubscription(
    outletId: string,
    planId: string,
    startDate: Date,
    endDate: Date,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.outletSubscription.create({
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

  async getActiveSubscription(
    outletId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.outletSubscription.findFirst({
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

  async hasActiveSubscription(
    outletId: string
  ): Promise<boolean> {
    const subscription =
      await prisma.outletSubscription.findFirst({
        where: {
          outletId,
          isActive: true,
          endDate: {
            gt: new Date(),
          },
        },
        select: {
          id: true,
        },
      });

    return !!subscription;
  },

  async deactivateSubscriptions(
    outletId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.outletSubscription.updateMany({
      where: {
        outletId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  },

  async outletExists(
    outletId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.outlet.findUnique({
      where: {
        id: outletId,
      },
      select: {
        id: true,
      },
    });
  },
};