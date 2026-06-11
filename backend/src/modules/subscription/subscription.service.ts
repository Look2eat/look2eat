import { AppError } from "../../common/errors/AppError";
import { subscriptionRepository } from "./subscription.repository";

export const subscriptionService = {
  async createPlan(
    name: string,
    durationMonths: number,
    price: number
  ) {
    if (!name.trim()) {
      throw new AppError("Plan name is required", 400);
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

  async getActiveSubscription(outletId: string) {
    return subscriptionRepository.getActiveSubscription(
      outletId
    );
  },

  async purchaseSubscription(
    outletId: string,
    planId: string
  ) {
    const plan =
      await subscriptionRepository.getPlanById(
        planId
      );

    if (!plan) {
      throw new AppError(
        "Subscription plan not found",
        404
      );
    }

    await subscriptionRepository.deactivateSubscriptions(
      outletId
    );

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() + plan.durationMonths
    );

    return subscriptionRepository.createSubscription(
      outletId,
      planId,
      startDate,
      endDate
    );
  },

  async purchaseCredits(
    outletId: string,
    credits: number,
    amountPaid: number
  ) {
    if (credits <= 0) {
      throw new AppError(
        "Credits must be greater than 0",
        400
      );
    }

    if (amountPaid <= 0) {
      throw new AppError(
        "Amount paid must be greater than 0",
        400
      );
    }

    let wallet =
      await subscriptionRepository.getCreditWallet(
        outletId
      );

    if (!wallet) {
      wallet =
        await subscriptionRepository.createCreditWallet(
          outletId
        );
    }

    await subscriptionRepository.incrementCredits(
      outletId,
      credits
    );

    await subscriptionRepository.createCreditTransaction(
      outletId,
      "PURCHASE",
      credits,
      amountPaid,
      `Purchased ${credits} credits`
    );

    return subscriptionRepository.getCreditWallet(
      outletId
    );
  },

  async consumeCredits(
    outletId: string,
    credits: number,
    description?: string
  ) {
    if (credits <= 0) {
      throw new AppError(
        "Credits must be greater than 0",
        400
      );
    }

    const wallet =
      await subscriptionRepository.getCreditWallet(
        outletId
      );

    if (!wallet) {
      throw new AppError(
        "Credit wallet not found",
        404
      );
    }

    if (wallet.balance < credits) {
      throw new AppError(
        "Insufficient credits",
        400
      );
    }

    await subscriptionRepository.decrementCredits(
      outletId,
      credits
    );

    await subscriptionRepository.createCreditTransaction(
      outletId,
      "CONSUMPTION",
      credits,
      undefined,
      description ?? "Credits consumed"
    );

    return subscriptionRepository.getCreditWallet(
      outletId
    );
  },

  async getCreditBalance(outletId: string) {
    const wallet =
      await subscriptionRepository.getCreditWallet(
        outletId
      );

    if (!wallet) {
      return {
        balance: 0,
        totalPurchased: 0,
        totalConsumed: 0,
      };
    }

    return wallet;
  },
};