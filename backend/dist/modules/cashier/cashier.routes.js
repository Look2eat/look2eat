"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashierRouter = void 0;
const express_1 = require("express");
const cashier_controller_1 = require("./cashier.controller");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
/**
 * Cashier API routes
 * POST /api/v1/cashier/request-otp - Request OTP
 * POST /api/v1/cashier/verify-otp - Verify OTP and get token
 * GET /api/v1/cashier/customer/:phone - Get customer info (protected)
 * POST /api/v1/cashier/transaction/purchase - Process purchase (protected)
 * POST /api/v1/cashier/transaction/redeem - Process redemption (protected)
 */
exports.cashierRouter = (0, express_1.Router)();
// Public routes (no authentication required)
exports.cashierRouter.post('/request-otp', (req, res) => cashier_controller_1.cashierController.requestOTP(req, res));
exports.cashierRouter.post('/verify-otp', (req, res) => cashier_controller_1.cashierController.verifyOTP(req, res));
// Protected routes (requires cashier JWT)
exports.cashierRouter.get('/customer/:phone', auth_middleware_1.authenticateCashierJwt, (req, res) => cashier_controller_1.cashierController.getCustomerInfo(req, res));
exports.cashierRouter.post('/transaction/purchase', auth_middleware_1.authenticateCashierJwt, (req, res) => cashier_controller_1.cashierController.processPurchase(req, res));
exports.cashierRouter.post('/transaction/redeem', auth_middleware_1.authenticateCashierJwt, (req, res) => cashier_controller_1.cashierController.processRedemption(req, res));
