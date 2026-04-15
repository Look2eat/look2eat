import express, { Router } from "express";
import { adminController } from "./admin.controller";
import { authenticateJwt } from "../../common/middleware/auth.middleware";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { adminValidation } from "./admin.validation";

export const adminRouter: Router = express.Router();

adminRouter.use(authenticateJwt);

adminRouter.post(
  "/brands/coin-ratio",
  validateRequest(adminValidation.setBrandCoinRatio),
  adminController.setBrandCoinRatio
);

adminRouter.get(
  "/brands/:brandId/coin-ratio",
  adminController.getBrandCoinRatio
);

adminRouter.get(
  "/brands",
  adminController.getBrandsList
);

adminRouter.post(
  "/cashiers",
  validateRequest(adminValidation.createCashier),
  adminController.createCashier
);

adminRouter.get(
  "/outlets/:outletId/cashiers",
  adminController.getCashiersByOutlet
);

adminRouter.patch(
  "/cashiers/:cashierId/deactivate",
  adminController.deactivateCashier
);

adminRouter.patch(
  "/cashiers/:cashierId/reactivate",
  adminController.reactivateCashier
);

adminRouter.post(
  "/milestones",
  validateRequest(adminValidation.createRewardMilestone),
  adminController.createRewardMilestone
);

adminRouter.get(
  "/brands/:brandId/milestones",
  adminController.getRewardMilestones
);

adminRouter.put(
  "/milestones/:milestoneId",
  validateRequest(adminValidation.updateRewardMilestone),
  adminController.updateRewardMilestone
);

adminRouter.get(
  "/transactions",
  adminController.getTransactionHistory
);

adminRouter.get(
  "/brands/:brandId/transactions/stats",
  adminController.getTransactionStats
);

adminRouter.get(
  "/brands/:brandId/dashboard",
  adminController.getDashboard
);
