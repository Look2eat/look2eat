"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicController = void 0;
const client_1 = require("../../prisma/client");
const AppError_1 = require("../../common/errors/AppError");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
exports.publicController = {
    async getLoyaltyPageData(req, res) {
        try {
            const slug = req.params.slug;
            const walletId = req.params.walletId;
            if (!slug || !walletId) {
                throw new AppError_1.AppError("Invalid URL parameters", 400);
            }
            const brand = await client_1.prisma.brand.findUnique({
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
                throw new AppError_1.AppError("Brand not found", 404);
            }
            const wallet = await client_1.prisma.coinWallet.findUnique({
                where: { id: walletId },
            });
            if (!wallet) {
                throw new AppError_1.AppError("Customer wallet not found", 404);
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
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    },
    async getBrandPublicData(req, res) {
        try {
            const slug = req.params.slug;
            if (!slug) {
                throw new AppError_1.AppError("Invalid URL parameters", 400);
            }
            const brand = await client_1.prisma.brand.findUnique({
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
                throw new AppError_1.AppError("Brand not found", 404);
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
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    },
    async verifyWebhook(req, res) {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        console.log(`🔍 Webhook verify attempt — mode: ${mode}, token: ${token}, challenge: ${challenge}`);
        console.log(`🔍 Expected token: ${process.env.WHATSAPP_VERIFY_TOKEN}`);
        if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log("✅ Webhook verified by Meta");
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(challenge);
        }
        else {
            console.warn("❌ Webhook verification failed — token mismatch or wrong mode");
            res.sendStatus(403);
        }
    },
    async handleWebhook(req, res) {
        res.sendStatus(200);
        try {
            const body = req.body;
            const entry = body?.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            // Handle status updates (delivery/read receipts or failures)
            if (value?.statuses && value.statuses.length > 0) {
                for (const status of value.statuses) {
                    console.log(`🔍 Webhook status update for message ID ${status.id}: ${status.status}`);
                    if (status.status === "failed") {
                        const errorMsg = status.errors?.[0]?.message || status.errors?.[0]?.title || "Message undeliverable";
                        console.error(`❌ WhatsApp message delivery failed for ID ${status.id}: ${errorMsg}`, status.errors);
                        await client_1.prisma.whatsAppMessage.updateMany({
                            where: { messageId: status.id },
                            data: {
                                status: "FAILED",
                                errorMessage: errorMsg,
                            },
                        });
                    }
                }
            }
            if (!value?.messages || value.messages.length === 0)
                return;
            const message = value.messages[0];
            const senderPhone = message.from;
            const context = message.context;
            const isButtonReply = message.type === "button" &&
                message.button?.text?.toLowerCase().includes("know more");
            const isTextKnowMore = message.type === "text" &&
                message.text?.body?.toLowerCase().includes("know more");
            if (!isButtonReply && !isTextKnowMore)
                return;
            console.log(`📩 "Know More" received from ${senderPhone}`);
            let brandId = null;
            if (context?.id) {
                const originalMsg = await client_1.prisma.whatsAppMessage.findFirst({
                    where: { messageId: context.id },
                    select: { brandId: true },
                });
                brandId = originalMsg?.brandId || null;
            }
            if (!brandId) {
                const recentWallet = await client_1.prisma.coinWallet.findFirst({
                    where: { phoneNumber: { contains: senderPhone.slice(-10) } },
                    orderBy: { updatedAt: "desc" },
                    select: { brandId: true },
                });
                brandId = recentWallet?.brandId || null;
            }
            if (!brandId) {
                await whatsapp_service_1.whatsappService.sendTextMessage(senderPhone, "Sorry, we couldn't find your loyalty account. Please visit the restaurant and make a purchase to get started! 🙏");
                return;
            }
            const brand = await client_1.prisma.brand.findUnique({
                where: { id: brandId },
                include: {
                    settings: true,
                    rewardMilestones: {
                        where: { isActive: true },
                        orderBy: { coinsRequired: "asc" },
                    },
                },
            });
            if (!brand)
                return;
            const wallet = await client_1.prisma.coinWallet.findFirst({
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
            const replyText = whatsapp_service_1.whatsappService.buildKnowMoreReply(brand.name, currentCoins, coinRatio, brand.rewardMilestones.map((m) => ({
                coinsRequired: m.coinsRequired,
                cashbackAmount: m.cashbackAmount,
            })), publicUrl);
            await whatsapp_service_1.whatsappService.sendTextMessage(senderPhone, replyText);
            console.log(`✅ Know More reply sent to ${senderPhone} for brand ${brand.name}`);
        }
        catch (error) {
            console.error("❌ Webhook handler error:", error);
        }
    },
};
