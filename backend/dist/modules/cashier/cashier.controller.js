"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierController = exports.CashierController = void 0;
const AppError_1 = require("../../common/errors/AppError");
const cashier_service_1 = require("./cashier.service");
const cashier_validation_1 = require("./cashier.validation");
class CashierController {
    async loginCashier(req, res) {
        try {
            const validatedData = cashier_validation_1.cashierLoginSchema.parse(req.body);
            const token = await cashier_service_1.cashierService.loginCashier(validatedData.phoneNumber, validatedData.password, validatedData.outletId);
            res.json({
                success: true,
                message: 'Cashier logged in successfully',
                data: {
                    token,
                    expiresIn: '8h',
                },
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    async requestCustomerOTP(req, res) {
        try {
            const validatedData = cashier_validation_1.requestCustomerOTPSchema.parse(req.body);
            const result = await cashier_service_1.cashierService.requestCustomerOTP(validatedData.customerPhoneNumber, validatedData.brandId);
            res.json({
                success: true,
                message: 'OTP sent to customer via WhatsApp',
                data: result,
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    async verifyCustomerOTP(req, res) {
        try {
            const validatedData = cashier_validation_1.verifyCustomerOTPSchema.parse(req.body);
            const result = await cashier_service_1.cashierService.verifyCustomerOTP(validatedData.customerPhoneNumber, validatedData.otp, validatedData.brandId);
            res.json({
                success: true,
                message: 'Customer OTP verified successfully',
                data: result,
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    async getCustomerInfo(req, res) {
        try {
            const { phone } = req.params;
            const { brandId } = req.query;
            if (typeof brandId !== 'string') {
                throw new AppError_1.AppError('Brand ID must be provided as query parameter', 400);
            }
            const validatedData = cashier_validation_1.getCustomerInfoSchema.parse({
                customerPhoneNumber: phone,
                brandId,
            });
            const customerInfo = await cashier_service_1.cashierService.getCustomerInfo(validatedData.customerPhoneNumber, validatedData.brandId);
            res.json({
                success: true,
                data: customerInfo,
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    async processPurchase(req, res) {
        try {
            const cashierAuth = req.cashierAuth;
            const validatedData = cashier_validation_1.processPurchaseSchema.parse(req.body);
            if (cashierAuth.brandId !== validatedData.brandId) {
                throw new AppError_1.AppError('Brand ID mismatch', 403);
            }
            const result = await cashier_service_1.cashierService.processPurchase(validatedData.customerPhoneNumber, validatedData.brandId, validatedData.purchaseAmount, cashierAuth.phoneNumber);
            res.json({
                success: true,
                message: 'Purchase processed successfully',
                data: result,
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    async processRedemption(req, res) {
        try {
            const cashierAuth = req.cashierAuth;
            const validatedData = cashier_validation_1.processRedemptionSchema.parse(req.body);
            if (cashierAuth.brandId !== validatedData.brandId) {
                throw new AppError_1.AppError('Brand ID mismatch', 403);
            }
            const result = await cashier_service_1.cashierService.processRedemption(validatedData.customerPhoneNumber, validatedData.brandId, validatedData.milestoneId, validatedData.purchaseAmount, cashierAuth.phoneNumber);
            res.json({
                success: true,
                message: 'Redemption processed successfully',
                data: result,
            });
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}
exports.CashierController = CashierController;
exports.cashierController = new CashierController();
