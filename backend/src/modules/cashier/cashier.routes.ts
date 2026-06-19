import { Router } from 'express';
import { cashierController } from './cashier.controller';
import { authenticateCashierJwt } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { cashierLoginSchema, requestCustomerOTPSchema, verifyCustomerOTPSchema } from './cashier.validation';
import { requireActiveSubscription } from "../subscription/subscription.middleware"


export const cashierRouter = Router();

cashierRouter.post(
  '/login',
  validateRequest(cashierLoginSchema),
  (req, res) => cashierController.loginCashier(req, res)
);

cashierRouter.post(
  '/request-customer-otp',
  validateRequest(requestCustomerOTPSchema),
  (req, res) => cashierController.requestCustomerOTP(req, res)
);

cashierRouter.post(
  '/verify-customer-otp',
  validateRequest(verifyCustomerOTPSchema),
  (req, res) => cashierController.verifyCustomerOTP(req, res)
);

cashierRouter.get(
  '/customer/:phone',
  authenticateCashierJwt,
  (req, res) => cashierController.getCustomerInfo(req, res)
);

cashierRouter.post(
  "/transaction/purchase",
  authenticateCashierJwt,
  requireActiveSubscription,
  (req, res) =>
    cashierController.processPurchase(req, res)
);

cashierRouter.post(
  "/transaction/redeem",
  authenticateCashierJwt,
  requireActiveSubscription,
  (req, res) =>
    cashierController.processRedemption(req, res)
);
