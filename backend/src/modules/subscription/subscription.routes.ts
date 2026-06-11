import express, { Router } from "express";

import { authenticateJwt } from "../../common/middleware/auth.middleware";
import { validateRequest } from "../../common/middleware/validation.middleware";

import { subscriptionController } from "./subscription.controller";
import { subscriptionValidation } from "./subscription.validation";

export const subscriptionRouter: Router = express.Router();

subscriptionRouter.use(authenticateJwt);

subscriptionRouter.post(
  "/plans",
  validateRequest(subscriptionValidation.createPlan),
  subscriptionController.createPlan
);

subscriptionRouter.get(
  "/plans",
  subscriptionController.getPlans
);

subscriptionRouter.post(
  "/purchase",
  validateRequest(subscriptionValidation.purchaseSubscription),
  subscriptionController.purchaseSubscription
);

subscriptionRouter.get(
  "/outlets/:outletId",
  subscriptionController.getActiveSubscription
);

subscriptionRouter.post(
  "/credits/purchase",
  validateRequest(subscriptionValidation.purchaseCredits),
  subscriptionController.purchaseCredits
);

subscriptionRouter.post(
  "/credits/consume",
  validateRequest(subscriptionValidation.consumeCredits),
  subscriptionController.consumeCredits
);

subscriptionRouter.get(
  "/credits/:outletId",
  subscriptionController.getCreditBalance
);