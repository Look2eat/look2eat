"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const validation_middleware_1 = require("../../common/middleware/validation.middleware");
const admin_validation_1 = require("./admin.validation");
exports.adminRouter = express_1.default.Router();
// All admin routes require authentication
exports.adminRouter.use(auth_middleware_1.authenticateJwt);
// Brand Coin Ratio Management
exports.adminRouter.post("/brands/coin-ratio", (0, validation_middleware_1.validateRequest)(admin_validation_1.adminValidation.setBrandCoinRatio), admin_controller_1.adminController.setBrandCoinRatio);
exports.adminRouter.get("/brands/:brandId/coin-ratio", admin_controller_1.adminController.getBrandCoinRatio);
// Brand List with Stats
exports.adminRouter.get("/brands", admin_controller_1.adminController.getBrandsList);
// Cashier Management
exports.adminRouter.post("/cashiers", (0, validation_middleware_1.validateRequest)(admin_validation_1.adminValidation.createCashier), admin_controller_1.adminController.createCashier);
exports.adminRouter.get("/outlets/:outletId/cashiers", admin_controller_1.adminController.getCashiersByOutlet);
exports.adminRouter.patch("/cashiers/:cashierId/deactivate", admin_controller_1.adminController.deactivateCashier);
exports.adminRouter.patch("/cashiers/:cashierId/reactivate", admin_controller_1.adminController.reactivateCashier);
// Reward Milestones
exports.adminRouter.post("/milestones", (0, validation_middleware_1.validateRequest)(admin_validation_1.adminValidation.createRewardMilestone), admin_controller_1.adminController.createRewardMilestone);
exports.adminRouter.get("/brands/:brandId/milestones", admin_controller_1.adminController.getRewardMilestones);
exports.adminRouter.put("/milestones/:milestoneId", (0, validation_middleware_1.validateRequest)(admin_validation_1.adminValidation.updateRewardMilestone), admin_controller_1.adminController.updateRewardMilestone);
// Transaction History
exports.adminRouter.get("/transactions", admin_controller_1.adminController.getTransactionHistory);
exports.adminRouter.get("/brands/:brandId/transactions/stats", admin_controller_1.adminController.getTransactionStats);
