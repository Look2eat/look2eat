import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { AppError } from "../../common/errors/AppError";
import { whatsappService } from "../../common/services/whatsapp.service";

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
  },

  async verifyWebhook(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("✅ Webhook verified by Meta");
      res.status(200).send(challenge);
    } else {
      console.warn("❌ Webhook verification failed");
      res.sendStatus(403);
    }
  },

  async handleWebhook(req: Request, res: Response) {
    res.sendStatus(200);

    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (!value?.messages || value.messages.length === 0) return;

      const message = value.messages[0];
      const senderPhone = message.from;
      const context = message.context;

      const isButtonReply =
        message.type === "button" &&
        message.button?.text?.toLowerCase().includes("know more");

      const isTextKnowMore =
        message.type === "text" &&
        message.text?.body?.toLowerCase().includes("know more");

      if (!isButtonReply && !isTextKnowMore) return;

      console.log(`📩 "Know More" received from ${senderPhone}`);

      let brandId: string | null = null;

      if (context?.id) {
        const originalMsg = await prisma.whatsAppMessage.findFirst({
          where: { messageId: context.id },
          select: { brandId: true },
        });
        brandId = originalMsg?.brandId || null;
      }

      if (!brandId) {
        const recentWallet = await prisma.coinWallet.findFirst({
          where: { phoneNumber: { contains: senderPhone.slice(-10) } },
          orderBy: { updatedAt: "desc" },
          select: { brandId: true },
        });
        brandId = recentWallet?.brandId || null;
      }

      if (!brandId) {
        await whatsappService.sendTextMessage(
          senderPhone,
          "Sorry, we couldn't find your loyalty account. Please visit the restaurant and make a purchase to get started! 🙏"
        );
        return;
      }

      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: {
          settings: true,
          rewardMilestones: {
            where: { isActive: true },
            orderBy: { coinsRequired: "asc" },
          },
        },
      });

      if (!brand) return;

      const wallet = await prisma.coinWallet.findFirst({
        where: {
          brandId,
          phoneNumber: { contains: senderPhone.slice(-10) },
        },
      });

      const currentCoins = wallet?.currentCoins || 0;
      const walletId = wallet?.id || "app";
      const coinRatio = brand.settings?.coinRatioValue || 0.05;

      const baseUrl = process.env.PUBLIC_WEB_URL || "https://www.zuplin.in";
      const publicUrl = `${baseUrl}/loyalty/${brand.slug}/${walletId}`;

      const replyText = whatsappService.buildKnowMoreReply(
        brand.name,
        currentCoins,
        coinRatio,
        brand.rewardMilestones.map((m) => ({
          coinsRequired: m.coinsRequired,
          cashbackAmount: m.cashbackAmount,
        })),
        publicUrl
      );

      await whatsappService.sendTextMessage(senderPhone, replyText);
      console.log(`✅ Know More reply sent to ${senderPhone} for brand ${brand.name}`);
    } catch (error) {
      console.error("❌ Webhook handler error:", error);
    }
  },
};
