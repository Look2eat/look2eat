import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminValidation } from "./admin.validation";
import { AppError } from "../../common/errors/AppError";

export const adminController = {
  async setBrandCoinRatio(req: Request, res: Response) {
    try {
      const { brandId, coinRatioValue } = adminValidation.setBrandCoinRatio.parse(
        req.body
      );

      const settings = await adminService.setBrandCoinRatio(
        brandId,
        coinRatioValue
      );

      res.status(200).json({
        message: "Brand coin ratio updated successfully",
        data: settings,
      });
    } catch (error) {
      throw error;
    }
  },

  async getBrandCoinRatio(req: Request, res: Response) {
    try {
      const { brandId } = req.params;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required", 400);
      }

      const settings = await adminService.getBrandCoinRatio(brandId);

      res.status(200).json({
        data: settings,
      });
    } catch (error) {
      throw error;
    }
  },

  async createCashier(req: Request, res: Response) {
    try {
      const { outletId, phoneNumber, name } =
        adminValidation.createCashier.parse(req.body);

      const cashier = await adminService.createCashier(
        outletId,
        phoneNumber,
        name
      );

      res.status(201).json({
        message: "Cashier created successfully",
        data: cashier,
      });
    } catch (error) {
      throw error;
    }
  },

  async getCashiersByOutlet(req: Request, res: Response) {
    try {
      const { outletId } = req.params;

      if (!outletId || Array.isArray(outletId)) {
        throw new AppError("Outlet ID is required", 400);
      }

      const cashiers = await adminService.getCashiersByOutlet(outletId);

      res.status(200).json({
        data: cashiers,
      });
    } catch (error) {
      throw error;
    }
  },

  async deactivateCashier(req: Request, res: Response) {
    try {
      const { cashierId } = req.params;

      if (!cashierId || Array.isArray(cashierId)) {
        throw new AppError("Cashier ID is required", 400);
      }

      const cashier = await adminService.deactivateCashier(cashierId);

      res.status(200).json({
        message: "Cashier deactivated successfully",
        data: cashier,
      });
    } catch (error) {
      throw error;
    }
  },

  async reactivateCashier(req: Request, res: Response) {
    try {
      const { cashierId } = req.params;

      if (!cashierId || Array.isArray(cashierId)) {
        throw new AppError("Cashier ID is required", 400);
      }

      const cashier = await adminService.reactivateCashier(cashierId);

      res.status(200).json({
        message: "Cashier reactivated successfully",
        data: cashier,
      });
    } catch (error) {
      throw error;
    }
  },

  async createRewardMilestone(req: Request, res: Response) {
    try {
      const { brandId, name, coinsRequired, cashbackAmount } =
        adminValidation.createRewardMilestone.parse(req.body);

      const milestone = await adminService.createRewardMilestone(
        brandId,
        name,
        coinsRequired,
        cashbackAmount
      );

      res.status(201).json({
        message: "Reward milestone created successfully",
        data: milestone,
      });
    } catch (error) {
      throw error;
    }
  },

  async getRewardMilestones(req: Request, res: Response) {
    try {
      const { brandId } = req.params;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required", 400);
      }

      const milestones = await adminService.getRewardMilestones(brandId);

      res.status(200).json({
        data: milestones,
      });
    } catch (error) {
      throw error;
    }
  },

  async updateRewardMilestone(req: Request, res: Response) {
    try {
      const { milestoneId } = req.params;
      const { coinsRequired, cashbackAmount } =
        adminValidation.updateRewardMilestone.parse(req.body);

      if (!milestoneId || Array.isArray(milestoneId)) {
        throw new AppError("Milestone ID is required", 400);
      }

      const milestone = await adminService.updateRewardMilestone(
        milestoneId,
        coinsRequired,
        cashbackAmount
      );

      res.status(200).json({
        message: "Reward milestone updated successfully",
        data: milestone,
      });
    } catch (error) {
      throw error;
    }
  },

  async getTransactionHistory(req: Request, res: Response) {
    try {
      const { brandId, limit, offset, customerPhone, type, startDate, endDate } =
        req.query;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required and must be a string", 400);
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      const customerPhoneStr = Array.isArray(customerPhone) ? customerPhone[0] : (customerPhone as string | undefined);
      const typeStr = Array.isArray(type) ? type[0] : (type as string | undefined);

      let startDateObj: Date | undefined;
      let endDateObj: Date | undefined;

      if (startDate && typeof startDate === 'string') {
        startDateObj = new Date(startDate);
      }
      if (endDate && typeof endDate === 'string') {
        endDateObj = new Date(endDate);
      }

      const validated = adminValidation.getTransactionHistory.parse({
        brandId,
        limit: limitNum,
        offset: offsetNum,
        customerPhone: customerPhoneStr,
        type: typeStr,
        startDate: startDateObj,
        endDate: endDateObj,
      });

      const transactions = await adminService.getTransactionHistory(
        validated.brandId,
        validated.limit,
        validated.offset,
        {
          customerPhone: validated.customerPhone,
          type: validated.type as "PURCHASE" | "REDEMPTION" | undefined,
          startDate: validated.startDate,
          endDate: validated.endDate,
        }
      );

      res.status(200).json({
        data: transactions,
        count: transactions.length,
      });
    } catch (error) {
      throw error;
    }
  },

  async getTransactionStats(req: Request, res: Response) {
    try {
      const { brandId } = req.params;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required", 400);
      }

      const stats = await adminService.getTransactionStats(brandId);

      res.status(200).json({
        data: stats,
      });
    } catch (error) {
      throw error;
    }
  },

  async getDashboard(req: Request, res: Response) {
    try {
      const { brandId } = req.params;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required", 400);
      }

      const dashboard = await adminService.getDashboardData(brandId);

      res.status(200).json({
        data: dashboard,
      });
    } catch (error) {
      throw error;
    }
  },

  async getBrandsList(req: Request, res: Response) {
    try {
      const brands = await adminService.getBrandsList();

      res.status(200).json({
        data: brands,
        count: brands.length,
      });
    } catch (error) {
      throw error;
    }
  },

  async uploadBrandImages(req: Request, res: Response) {
    try {
      const { brandId } = req.params;

      if (!brandId || Array.isArray(brandId)) {
        throw new AppError("Brand ID is required", 400);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoUrl = files?.logo?.[0]?.path;
      const bannerImageUrl = files?.banner?.[0]?.path;

      const updatedBrand = await adminService.uploadBrandImages(brandId, logoUrl, bannerImageUrl);

      res.status(200).json({
        message: "Brand images uploaded successfully",
        data: updatedBrand,
      });
    } catch (error) {
      throw error;
    }
  },
};
