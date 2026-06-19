import { Request, Response } from "express";

import { AppError } from "../../common/errors/AppError";
import { subscriptionService } from "./subscription.service";
import { subscriptionValidation } from "./subscription.validation";

export const subscriptionController = {
  async createPlan(
    req: Request,
    res: Response
  ) {
    const {
      name,
      durationMonths,
      price,
    } =
      subscriptionValidation.createPlan.parse(
        req.body
      );

    const plan =
      await subscriptionService.createPlan(
        name,
        durationMonths,
        price
      );

    res.status(201).json({
      message: "Plan created successfully",
      data: plan,
    });
  },

  async getPlans(
    req: Request,
    res: Response
  ) {
    const plans =
      await subscriptionService.getPlans();

    res.status(200).json({
      data: plans,
      count: plans.length,
    });
  },


  async getActiveSubscription(
    req: Request,
    res: Response
  ) {
    const { outletId } = req.params;

    if (!outletId || Array.isArray(outletId)) {
      throw new AppError(
        "Outlet ID is required",
        400
      );
    }

    const subscription =
      await subscriptionService.getActiveSubscription(
        outletId
      );

    res.status(200).json({
      data: subscription,
    });
  },
};