import { Request, Response } from "express";

import { AppError } from "../../common/errors/AppError";
import { subscriptionService } from "./subscription.service";
import { subscriptionValidation } from "./subscription.validation";

export const subscriptionController = {
  async createPlan(req: Request, res: Response) {
    try {
      const { name, durationMonths, price } =
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
    } catch (error) {
      throw error;
    }
  },

  async getPlans(req: Request, res: Response) {
    try {
      const plans =
        await subscriptionService.getPlans();

      res.status(200).json({
        data: plans,
        count: plans.length,
      });
    } catch (error) {
      throw error;
    }
  },

  async purchaseSubscription(
    req: Request,
    res: Response
  ) {
    try {
      const { outletId, planId } =
        subscriptionValidation.purchaseSubscription.parse(
          req.body
        );

      const subscription =
        await subscriptionService.purchaseSubscription(
          outletId,
          planId
        );

      res.status(201).json({
        message:
          "Subscription purchased successfully",
        data: subscription,
      });
    } catch (error) {
      throw error;
    }
  },

  async getActiveSubscription(
    req: Request,
    res: Response
  ) {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  async purchaseCredits(
    req: Request,
    res: Response
  ) {
    try {
      const {
        outletId,
        credits,
        amountPaid,
      } =
        subscriptionValidation.purchaseCredits.parse(
          req.body
        );

      const wallet =
        await subscriptionService.purchaseCredits(
          outletId,
          credits,
          amountPaid
        );

      res.status(200).json({
        message:
          "Credits purchased successfully",
        data: wallet,
      });
    } catch (error) {
      throw error;
    }
  },

  async consumeCredits(
    req: Request,
    res: Response
  ) {
    try {
      const {
        outletId,
        credits,
        description,
      } =
        subscriptionValidation.consumeCredits.parse(
          req.body
        );

      const wallet =
        await subscriptionService.consumeCredits(
          outletId,
          credits,
          description
        );

      res.status(200).json({
        message:
          "Credits consumed successfully",
        data: wallet,
      });
    } catch (error) {
      throw error;
    }
  },

  async getCreditBalance(
    req: Request,
    res: Response
  ) {
    try {
      const { outletId } = req.params;

      if (!outletId || Array.isArray(outletId)) {
        throw new AppError(
          "Outlet ID is required",
          400
        );
      }

      const wallet =
        await subscriptionService.getCreditBalance(
          outletId
        );

      res.status(200).json({
        data: wallet,
      });
    } catch (error) {
      throw error;
    }
  },
};