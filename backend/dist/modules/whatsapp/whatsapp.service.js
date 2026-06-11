"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../../prisma/client");
const AppError_1 = require("../../common/errors/AppError");
const env_1 = require("../../config/env");
const whatsapp_templates_1 = require("./whatsapp.templates");
const WHATSAPP_API_URL = `https://graph.facebook.com/${env_1.env.whatsappApiVersion}/${env_1.env.whatsappPhoneNumberId}/messages`;
exports.whatsappService = {
    formatPhoneNumber(phoneNumber) {
        const digits = phoneNumber.replace(/\D/g, "");
        if (digits.length === 10) {
            return "91" + digits;
        }
        return digits;
    },
    async sendMessage(message, retries = 3) {
        const { phoneNumber, templateName, variables, brandId } = message;
        const templateConfig = whatsapp_templates_1.TEMPLATE_MAPPING[templateName];
        if (!templateConfig) {
            throw new AppError_1.AppError(`Unknown template: ${templateName}`, 400);
        }
        const missingParams = templateConfig.paramNames.filter((p) => !variables[p]);
        if (missingParams.length > 0) {
            throw new AppError_1.AppError(`Missing template parameters: ${missingParams.join(", ")}`, 400);
        }
        const brand = await client_1.prisma.brand.findUnique({
            where: { id: brandId },
            select: { slug: true }
        });
        const brandSlug = brand?.slug || "app";
        const wallet = await client_1.prisma.coinWallet.findFirst({
            where: { phoneNumber, brandId },
            select: { id: true }
        });
        const walletId = wallet?.id || phoneNumber.replace(/^\+/, '');
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const messageBody = exports.whatsappService.buildMessageBody(phoneNumber, templateName, variables, brandSlug, walletId);
                console.log(`[WhatsApp Outbound] Sending template message to number format: ${messageBody.to}`);
                console.log(`[WhatsApp Outbound] Full Payload:`, JSON.stringify(messageBody, null, 2));
                const response = await axios_1.default.post(WHATSAPP_API_URL, messageBody, {
                    headers: {
                        Authorization: `Bearer ${env_1.env.whatsappAccessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const messageId = response.data?.messages?.[0]?.id;
                await client_1.prisma.whatsAppMessage.create({
                    data: {
                        brandId,
                        phoneNumber: `+${exports.whatsappService.formatPhoneNumber(phoneNumber)}`,
                        templateName,
                        variables: JSON.stringify(variables),
                        status: "SENT",
                        messageId,
                        sentAt: new Date(),
                    },
                });
                console.log(`WhatsApp message sent to ${phoneNumber}`);
                return true;
            }
            catch (error) {
                lastError = error;
                const axiosError = error;
                const errorData = axiosError.response?.data;
                const errorMessage = errorData?.error?.message || String(error);
                console.error(`❌ Attempt ${attempt}/${retries} failed for ${phoneNumber}: ${errorMessage}`);
                if (errorMessage.includes("not a valid") ||
                    errorMessage.includes("no valid") ||
                    errorMessage.includes("Invalid phone")) {
                    await client_1.prisma.whatsAppMessage.create({
                        data: {
                            brandId,
                            phoneNumber: `+${exports.whatsappService.formatPhoneNumber(phoneNumber)}`,
                            templateName,
                            variables: JSON.stringify(variables),
                            status: "FAILED_INVALID_NUMBER",
                            errorMessage,
                        },
                    });
                    return false;
                }
                if (attempt === retries) {
                    await client_1.prisma.whatsAppMessage.create({
                        data: {
                            brandId,
                            phoneNumber: `+${exports.whatsappService.formatPhoneNumber(phoneNumber)}`,
                            templateName,
                            variables: JSON.stringify(variables),
                            status: "FAILED",
                            errorMessage: errorMessage,
                        },
                    });
                }
                if (attempt < retries) {
                    await new Promise((r) => setTimeout(r, 1000 * attempt));
                }
            }
        }
        console.error(`❌ All ${retries} attempts failed for ${phoneNumber}. Last error: ${lastError}`);
        return false;
    },
    buildMessageBody(phoneNumber, templateName, variables, brandSlug, walletId) {
        const templateConfig = whatsapp_templates_1.TEMPLATE_MAPPING[templateName];
        const paramNames = templateConfig.paramNames;
        const isOTP = templateName === env_1.env.whatsappTemplateOtp;
        const parameters = paramNames.map((paramName) => {
            const obj = {
                type: "text",
                text: variables[paramName],
            };
            if (!isOTP) {
                obj.parameter_name = paramName;
            }
            return obj;
        });
        const components = [
            {
                type: "body",
                parameters,
            },
        ];
        const buttonPayload = isOTP && variables["otp"] ? variables["otp"] : `${brandSlug}/${walletId}`;
        components.push({
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
                {
                    type: "text",
                    text: buttonPayload,
                },
            ],
        });
        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: exports.whatsappService.formatPhoneNumber(phoneNumber),
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: "en",
                },
                components,
            },
        };
    },
    async sendOTP(phoneNumber, otp, brandId) {
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName: env_1.env.whatsappTemplateOtp,
            variables: {
                otp,
            },
            brandId,
        }, 2);
    },
    async sendPurchaseNotification(phoneNumber, restaurantName, points, brandId, isNew) {
        const templateName = env_1.env.whatsappTemplateFirstPurchase;
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName,
            variables: {
                restaurant_name: restaurantName,
                points: points.toString(),
            },
            brandId,
        }, 3);
    },
    async sendRedemptionNotification(phoneNumber, restaurantName, redeemedCoins, earnedCoins, totalCoins, brandId) {
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName: env_1.env.whatsappTemplatePurchaseRedeem,
            variables: {
                restaurant_name: restaurantName,
                redeem: redeemedCoins.toString(),
                earned: earnedCoins.toString(),
                total: totalCoins.toString(),
            },
            brandId,
        }, 3);
    },
    async sendExpiryWarning(phoneNumber, restaurantName, points, expiryDate, brandId) {
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName: env_1.env.whatsappTemplateExpiryWarning,
            variables: {
                restaurant_name: restaurantName,
                points: points.toString(),
                date: expiryDate,
            },
            brandId,
        }, 2);
    },
    async sendTextMessage(phoneNumber, text) {
        try {
            const formattedNum = exports.whatsappService.formatPhoneNumber(phoneNumber);
            console.log(`[WhatsApp Outbound] Sending text message to number format: ${formattedNum}`);
            await axios_1.default.post(WHATSAPP_API_URL, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedNum,
                type: "text",
                text: { body: text },
            }, {
                headers: {
                    Authorization: `Bearer ${env_1.env.whatsappAccessToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(`✅ Text message sent to ${phoneNumber}`);
            return true;
        }
        catch (error) {
            const axiosError = error;
            const errorData = axiosError.response?.data;
            console.error(`❌ Failed to send text message to ${phoneNumber}:`, errorData?.error?.message || String(error));
            return false;
        }
    },
    buildKnowMoreReply(brandName, currentCoins, coinRatioValue, milestones, publicUrl) {
        const milestoneLines = milestones
            .map((m) => {
            if (currentCoins >= m.coinsRequired) {
                return `✅ ${m.coinsRequired} coins  →  ₹${m.cashbackAmount} cashback`;
            }
            else {
                return `⬜ ${m.coinsRequired} coins  →  ₹${m.cashbackAmount} cashback`;
            }
        })
            .join("\n");
        return (`Welcome to *${brandName} Loyalty Program* 🎉\n\n` +
            `Thank you for choosing ${brandName}. Your loyalty means a lot to us.\n\n` +
            `💰 *Wallet Balance:* ${currentCoins} coins\n\n` +
            `📊 *Reward Milestones*\n\n` +
            `${milestoneLines}\n\n` +
            `📌 *How to Redeem*\n` +
            `Simply share your registered mobile number with our team and we'll process your cashback promptly.\n\n` +
            `🔗 *View Rewards Portal:*\n` +
            `${publicUrl}\n\n`);
    },
};
