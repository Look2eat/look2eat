"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const admin_validation_1 = require("./admin.validation");
const AppError_1 = require("../../common/errors/AppError");
exports.adminController = {
    async setBrandCoinRatio(req, res) {
        try {
            const { brandId, coinRatioValue } = admin_validation_1.adminValidation.setBrandCoinRatio.parse(req.body);
            const settings = await admin_service_1.adminService.setBrandCoinRatio(brandId, coinRatioValue);
            res.status(200).json({
                message: "Brand coin ratio updated successfully",
                data: settings,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getBrandCoinRatio(req, res) {
        try {
            const { brandId } = req.params;
            if (!brandId || Array.isArray(brandId)) {
                throw new AppError_1.AppError("Brand ID is required", 400);
            }
            const settings = await admin_service_1.adminService.getBrandCoinRatio(brandId);
            res.status(200).json({
                data: settings,
            });
        }
        catch (error) {
            throw error;
        }
    },
    // Cashier Management
    async createCashier(req, res) {
        try {
            const { outletId, phoneNumber, name } = admin_validation_1.adminValidation.createCashier.parse(req.body);
            const cashier = await admin_service_1.adminService.createCashier(outletId, phoneNumber, name);
            res.status(201).json({
                message: "Cashier created successfully",
                data: cashier,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getCashiersByOutlet(req, res) {
        try {
            const { outletId } = req.params;
            if (!outletId || Array.isArray(outletId)) {
                throw new AppError_1.AppError("Outlet ID is required", 400);
            }
            const cashiers = await admin_service_1.adminService.getCashiersByOutlet(outletId);
            res.status(200).json({
                data: cashiers,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async deactivateCashier(req, res) {
        try {
            const { cashierId } = req.params;
            if (!cashierId || Array.isArray(cashierId)) {
                throw new AppError_1.AppError("Cashier ID is required", 400);
            }
            const cashier = await admin_service_1.adminService.deactivateCashier(cashierId);
            res.status(200).json({
                message: "Cashier deactivated successfully",
                data: cashier,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async reactivateCashier(req, res) {
        try {
            const { cashierId } = req.params;
            if (!cashierId || Array.isArray(cashierId)) {
                throw new AppError_1.AppError("Cashier ID is required", 400);
            }
            const cashier = await admin_service_1.adminService.reactivateCashier(cashierId);
            res.status(200).json({
                message: "Cashier reactivated successfully",
                data: cashier,
            });
        }
        catch (error) {
            throw error;
        }
    },
    // Reward Milestones
    async createRewardMilestone(req, res) {
        try {
            const { brandId, name, coinsRequired, cashbackAmount } = admin_validation_1.adminValidation.createRewardMilestone.parse(req.body);
            const milestone = await admin_service_1.adminService.createRewardMilestone(brandId, name, coinsRequired, cashbackAmount);
            res.status(201).json({
                message: "Reward milestone created successfully",
                data: milestone,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getRewardMilestones(req, res) {
        try {
            const { brandId } = req.params;
            if (!brandId || Array.isArray(brandId)) {
                throw new AppError_1.AppError("Brand ID is required", 400);
            }
            const milestones = await admin_service_1.adminService.getRewardMilestones(brandId);
            res.status(200).json({
                data: milestones,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async updateRewardMilestone(req, res) {
        try {
            const { milestoneId } = req.params;
            const { coinsRequired, cashbackAmount } = admin_validation_1.adminValidation.updateRewardMilestone.parse(req.body);
            if (!milestoneId || Array.isArray(milestoneId)) {
                throw new AppError_1.AppError("Milestone ID is required", 400);
            }
            const milestone = await admin_service_1.adminService.updateRewardMilestone(milestoneId, coinsRequired, cashbackAmount);
            res.status(200).json({
                message: "Reward milestone updated successfully",
                data: milestone,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getTransactionHistory(req, res) {
        try {
            const { brandId, limit, offset, customerPhone, type, startDate, endDate } = req.query;
            if (!brandId || Array.isArray(brandId)) {
                throw new AppError_1.AppError("Brand ID is required and must be a string", 400);
            }
            // Convert query params safely
            const limitNum = limit ? parseInt(limit) : 50;
            const offsetNum = offset ? parseInt(offset) : 0;
            const customerPhoneStr = Array.isArray(customerPhone) ? customerPhone[0] : customerPhone;
            const typeStr = Array.isArray(type) ? type[0] : type;
            let startDateObj;
            let endDateObj;
            if (startDate && typeof startDate === 'string') {
                startDateObj = new Date(startDate);
            }
            if (endDate && typeof endDate === 'string') {
                endDateObj = new Date(endDate);
            }
            const validated = admin_validation_1.adminValidation.getTransactionHistory.parse({
                brandId,
                limit: limitNum,
                offset: offsetNum,
                customerPhone: customerPhoneStr,
                type: typeStr,
                startDate: startDateObj,
                endDate: endDateObj,
            });
            const transactions = await admin_service_1.adminService.getTransactionHistory(validated.brandId, validated.limit, validated.offset, {
                customerPhone: validated.customerPhone,
                type: validated.type,
                startDate: validated.startDate,
                endDate: validated.endDate,
            });
            res.status(200).json({
                data: transactions,
                count: transactions.length,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getTransactionStats(req, res) {
        try {
            const { brandId } = req.params;
            if (!brandId || Array.isArray(brandId)) {
                throw new AppError_1.AppError("Brand ID is required", 400);
            }
            const stats = await admin_service_1.adminService.getTransactionStats(brandId);
            res.status(200).json({
                data: stats,
            });
        }
        catch (error) {
            throw error;
        }
    },
    async getBrandsList(req, res) {
        try {
            const brands = await admin_service_1.adminService.getBrandsList();
            res.status(200).json({
                data: brands,
                count: brands.length,
            });
        }
        catch (error) {
            throw error;
        }
    },
};
