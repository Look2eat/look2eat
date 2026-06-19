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


subscriptionRouter.get(
  "/outlets/:outletId",
  subscriptionController.getActiveSubscription
);