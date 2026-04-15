import { Request, Response } from 'express';
import { AppError } from '../../common/errors/AppError';
import { CashierAuthRequest } from '../../common/middleware/auth.middleware';
import { cashierService } from './cashier.service';
import {
  cashierLoginSchema,
  requestCustomerOTPSchema,
  verifyCustomerOTPSchema,
  getCustomerInfoSchema,
  processPurchaseSchema,
  processRedemptionSchema,
} from './cashier.validation';

export class CashierController {

  async loginCashier(req: Request, res: Response) {
    try {
      const validatedData = cashierLoginSchema.parse(req.body);
      const token = await cashierService.loginCashier(
        validatedData.phoneNumber,
        validatedData.password,
        validatedData.outletId
      );

      res.json({
        success: true,
        message: 'Cashier logged in successfully',
        data: {
          token,
          expiresIn: '8h',
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async requestCustomerOTP(req: Request, res: Response) {
    try {
      const validatedData = requestCustomerOTPSchema.parse(req.body);
      const result = await cashierService.requestCustomerOTP(
        validatedData.customerPhoneNumber,
        validatedData.brandId
      );

      res.json({
        success: true,
        message: 'OTP sent to customer via WhatsApp',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async verifyCustomerOTP(req: Request, res: Response) {
    try {
      const validatedData = verifyCustomerOTPSchema.parse(req.body);
      const result = await cashierService.verifyCustomerOTP(
        validatedData.customerPhoneNumber,
        validatedData.otp,
        validatedData.brandId
      );

      res.json({
        success: true,
        message: 'Customer OTP verified successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async getCustomerInfo(req: Request, res: Response) {
    try {
      const { phone } = req.params;
      const { brandId } = req.query;

      if (typeof brandId !== 'string') {
        throw new AppError('Brand ID must be provided as query parameter', 400);
      }

      const validatedData = getCustomerInfoSchema.parse({
        customerPhoneNumber: phone,
        brandId,
      });

      const customerInfo = await cashierService.getCustomerInfo(
        validatedData.customerPhoneNumber,
        validatedData.brandId
      );

      res.json({
        success: true,
        data: customerInfo,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async processPurchase(req: Request, res: Response) {
    try {
      const cashierAuth = (req as CashierAuthRequest).cashierAuth;
      const validatedData = processPurchaseSchema.parse(req.body);

      if (cashierAuth.brandId !== validatedData.brandId) {
        throw new AppError('Brand ID mismatch', 403);
      }

      const result = await cashierService.processPurchase(
        validatedData.customerPhoneNumber,
        validatedData.brandId,
        validatedData.purchaseAmount,
        cashierAuth.phoneNumber
      );

      res.json({
        success: true,
        message: 'Purchase processed successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async processRedemption(req: Request, res: Response) {
    try {
      const cashierAuth = (req as CashierAuthRequest).cashierAuth;
      const validatedData = processRedemptionSchema.parse(req.body);

      if (cashierAuth.brandId !== validatedData.brandId) {
        throw new AppError('Brand ID mismatch', 403);
      }

      const result = await cashierService.processRedemption(
        validatedData.customerPhoneNumber,
        validatedData.brandId,
        validatedData.milestoneId,
        validatedData.purchaseAmount,
        cashierAuth.phoneNumber
      );

      res.json({
        success: true,
        message: 'Redemption processed successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }
}

export const cashierController = new CashierController();
