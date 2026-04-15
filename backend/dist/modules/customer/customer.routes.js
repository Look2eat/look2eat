"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = require("express");
const customer_controller_1 = require("./customer.controller");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
exports.customerRouter = (0, express_1.Router)();
// Assuming the customer authenticates via OTP and gets a JWT,
// or we just reuse the generic authenticateJwt for now for the prototype.
exports.customerRouter.get("/wallet/:phone", auth_middleware_1.authenticateJwt, customer_controller_1.customerController.getDashboard);
