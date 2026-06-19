import { Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { subscriptionRepository } from "./subscription.repository";

export const subscriptionService = {
  async createPlan(
    name: string,
    durationMonths: number,
    price: number
  ) {
    if (!name.trim()) {
      throw new AppError(
        "Plan name is required",
        400
      );
    }

    if (durationMonths <= 0) {
      throw new AppError(
        "Duration must be greater than 0",
        400
      );
    }

    if (price <= 0) {
      throw new AppError(
        "Price must be greater than 0",
        400
      );
    }

    return subscriptionRepository.createPlan(
      name,
      durationMonths,
      price
    );
  },

  async getPlans() {
    return subscriptionRepository.getPlans();
  },

  async getActiveSubscription(
    outletId: string
  ) {
    const subscription =
      await subscriptionRepository.getActiveSubscription(
        outletId
      );

    if (!subscription) {
      return null;
    }

    const daysRemaining = Math.ceil(
      (subscription.endDate.getTime() -
        Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      ...subscription,
      daysRemaining,
    };
  },

  async hasActiveSubscription(
    outletId: string
  ) {
    return subscriptionRepository.hasActiveSubscription(
      outletId
    );
  },

  async purchaseSubscription(
    outletId: string,
    planId: string,
    tx?: Prisma.TransactionClient
  ) {
    const outlet =
      await subscriptionRepository.outletExists(
        outletId,
        tx
      );

    if (!outlet) {
      throw new AppError(
        "Outlet not found",
        404
      );
    }

    const plan =
      await subscriptionRepository.getPlanById(
        planId,
        tx
      );

    if (!plan) {
      throw new AppError(
        "Subscription plan not found",
        404
      );
    }

    const currentSubscription =
      await subscriptionRepository.getActiveSubscription(
        outletId,
        tx
      );

    const startDate =
      currentSubscription?.endDate &&
      currentSubscription.endDate >
        new Date()
        ? new Date(
            currentSubscription.endDate
          )
        : new Date();

    const endDate = new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() +
        plan.durationMonths
    );

    await subscriptionRepository.deactivateSubscriptions(
      outletId,
      tx
    );

    return subscriptionRepository.createSubscription(
      outletId,
      planId,
      startDate,
      endDate,
      tx
    );
  },
};