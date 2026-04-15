"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierController = exports.CashierController = void 0;
const AppError_1 = require("../../common/errors/AppError");
const cashier_service_1 = require("./cashier.service");
const cashier_validation_1 = require("./cashier.validation");
/**
 * Cashier controller
 * Handles HTTP requests for cashier login and customer operations
 */
class CashierController {
    /**
     * POST /cashier/request-otp
     * Request OTP for cashier login
     */
    async requestOTP(req, res) {
        try {
            const validatedData = cashier_validation_1.requestOTPSchema.parse(req.body);
            const result = await cashier_service_1.cashierService.requestOTP(validatedData.phoneNumber, validatedData.outletId, validatedData.brandId);
            res.json({
                success: true,
                message: 'OTP sent to cashier phone',
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
                // Zod validation error
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
    /**
     * POST /cashier/verify-otp
     * Verify OTP and return JWT token
     */
    async verifyOTP(req, res) {
        try {
            const validatedData = cashier_validation_1.verifyOTPSchema.parse(req.body);
            const token = await cashier_service_1.cashierService.verifyOTP(validatedData.phoneNumber, validatedData.otp, validatedData.outletId, validatedData.brandId);
            res.json({
                success: true,
                message: 'OTP verified successfully',
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
    /**
     * GET /cashier/customer/:phone
     * Get customer wallet and milestone info for displaying in cashier UI
     */
    async getCustomerInfo(req, res) {
        try {
            const { phone } = req.params;
            const { brandId } = req.query;
            // Parse and validate query parameters
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
    /**
     * POST /cashier/transaction/purchase
     * Process a purchase transaction (protected)
     */
    async processPurchase(req, res) {
        try {
            const cashierAuth = req.cashierAuth;
            const validatedData = cashier_validation_1.processPurchaseSchema.parse(req.body);
            // Validate brand ID from token matches request
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
    /**
     * POST /cashier/transaction/redeem
     * Process a redemption transaction (protected)
     */
    async processRedemption(req, res) {
        try {
            const cashierAuth = req.cashierAuth;
            const validatedData = cashier_validation_1.processRedemptionSchema.parse(req.body);
            // Validate brand ID from token matches request
            if (cashierAuth.brandId !== validatedData.brandId) {
                throw new AppError_1.AppError('Brand ID mismatch', 403);
            }
            const result = await cashier_service_1.cashierService.processRedemption(validatedData.customerPhoneNumber, validatedData.brandId, validatedData.milestoneId, cashierAuth.phoneNumber);
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
