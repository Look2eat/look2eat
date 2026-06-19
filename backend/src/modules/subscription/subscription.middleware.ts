import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../../common/errors/AppError";
import { subscriptionRepository } from "./subscription.repository";
import { CashierAuthRequest } from "../../common/middleware/auth.middleware";

export async function requireActiveSubscription(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const cashierReq =
      req as CashierAuthRequest;

    const outletId =
      cashierReq.cashierAuth?.outletId ||
      req.body?.outletId;

    if (!outletId) {
      throw new AppError(
        "Outlet ID is required",
        400
      );
    }

    const hasSubscription =
      await subscriptionRepository.hasActiveSubscription(
        outletId
      );

    if (!hasSubscription) {
      throw new AppError(
        "Active subscription required",
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}