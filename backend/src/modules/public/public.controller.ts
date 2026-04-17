import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { AppError } from "../../common/errors/AppError";

export const publicController = {
  async getLoyaltyPageData(req: Request, res: Response) {
    try {
      const slug = req.params.slug as string;
      const walletId = req.params.walletId as string;

      if (!slug || !walletId) {
        throw new AppError("Invalid URL parameters", 400);
      }

      const brand: any = await prisma.brand.findUnique({
        where: { slug },
        include: {
          settings: true,
          rewardMilestones: {
            where: { isActive: true },
            orderBy: { coinsRequired: "asc" }
          }
        }
      });

      if (!brand) {
        throw new AppError("Brand not found", 404);
      }

      const wallet = await prisma.coinWallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet) {
        throw new AppError("Customer wallet not found", 404);
      }

      res.status(200).json({
        data: {
          brand: {
            id: brand.id,
            name: brand.name,
            logoUrl: brand.logoUrl,
            bannerImageUrl: brand.bannerImageUrl,
          },
          settings: {
            coinRatioValue: brand.settings?.coinRatioValue || 10,
          },
          wallet: {
            id: wallet.id,
            currentCoins: wallet.currentCoins,
            expiryDate: wallet.expiryDate,
            totalCoinsEarned: wallet.totalCoinsEarned,
          },
          milestones: brand.rewardMilestones
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },

  async getBrandPublicData(req: Request, res: Response) {
    try {
      const slug = req.params.slug as string;

      if (!slug) {
        throw new AppError("Invalid URL parameters", 400);
      }

      const brand = await prisma.brand.findUnique({
        where: { slug },
        include: {
          settings: true,
          rewardMilestones: {
            where: { isActive: true },
            orderBy: { coinsRequired: "asc" },
          },
        },
      });

      if (!brand) {
        throw new AppError("Brand not found", 404);
      }

      res.status(200).json({
        data: {
          brand: {
            id: brand.id,
            name: brand.name,
            logoUrl: brand.logoUrl,
            bannerImageUrl: brand.bannerImageUrl,
            description: brand.description,
          },
          settings: {
            coinRatioValue: brand.settings?.coinRatioValue || 10,
          },
          milestones: brand.rewardMilestones,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
};

