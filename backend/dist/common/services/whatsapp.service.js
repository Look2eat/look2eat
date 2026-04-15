"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappService = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../../prisma/client");
const AppError_1 = require("../errors/AppError");
const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const TEMPLATE_MAPPING = {
    [process.env.WHATSAPP_TEMPLATE_OTP]: {
        paramNames: ["otp"],
    },
    [process.env.WHATSAPP_TEMPLATE_FIRST_PURCHASE]: {
        paramNames: ["restaurant_name", "points"],
    },
    [process.env.WHATSAPP_TEMPLATE_PURCHASE]: {
        paramNames: ["restaurant_name", "points"],
    },
    [process.env.WHATSAPP_TEMPLATE_PURCHASE_REDEEM]: {
        paramNames: ["restaurant_name", "redeem", "earned", "total"],
    },
    [process.env.WHATSAPP_TEMPLATE_EXPIRY_WARNING]: {
        paramNames: ["restaurant_name", "points", "date"],
    },
};
exports.whatsappService = {
    async sendMessage(message, retries = 3) {
        const { phoneNumber, templateName, variables, brandId } = message;
        // Build parameters from template config
        const templateConfig = TEMPLATE_MAPPING[templateName];
        if (!templateConfig) {
            throw new AppError_1.AppError(`Unknown template: ${templateName}`, 400);
        }
        // Validate all required parameters are provided
        const missingParams = templateConfig.paramNames.filter((p) => !variables[p]);
        if (missingParams.length > 0) {
            throw new AppError_1.AppError(`Missing template parameters: ${missingParams.join(", ")}`, 400);
        }
        // Start retry loop
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Build message body based on template
                const messageBody = exports.whatsappService.buildMessageBody(phoneNumber, templateName, variables);
                // Call Meta API
                const response = await axios_1.default.post(WHATSAPP_API_URL, messageBody, {
                    headers: {
                        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });
                const messageId = response.data?.messages?.[0]?.id;
                // Log successful message
                await client_1.prisma.whatsAppMessage.create({
                    data: {
                        brandId,
                        phoneNumber: phoneNumber.startsWith("+")
                            ? phoneNumber
                            : `+${phoneNumber}`,
                        templateName,
                        variables: JSON.stringify(variables),
                        status: "SENT",
                        messageId,
                        sentAt: new Date(),
                    },
                });
                console.log(`✅ WhatsApp message sent to ${phoneNumber} (templateId: ${messageId})`);
                return true;
            }
            catch (error) {
                lastError = error;
                const axiosError = error;
                const errorData = axiosError.response?.data;
                const errorMessage = errorData?.error?.message || String(error);
                console.error(`❌ Attempt ${attempt}/${retries} failed for ${phoneNumber}: ${errorMessage}`);
                // Check for invalid number error (not WhatsApp user)
                if (errorMessage.includes("not a valid") ||
                    errorMessage.includes("no valid") ||
                    errorMessage.includes("Invalid phone")) {
                    await client_1.prisma.whatsAppMessage.create({
                        data: {
                            brandId,
                            phoneNumber: phoneNumber.startsWith("+")
                                ? phoneNumber
                                : `+${phoneNumber}`,
                            templateName,
                            variables: JSON.stringify(variables),
                            status: "FAILED_INVALID_NUMBER",
                            errorMessage,
                        },
                    });
                    return false; // Don't retry for invalid numbers
                }
                // Log failed attempt
                if (attempt === retries) {
                    await client_1.prisma.whatsAppMessage.create({
                        data: {
                            brandId,
                            phoneNumber: phoneNumber.startsWith("+")
                                ? phoneNumber
                                : `+${phoneNumber}`,
                            templateName,
                            variables: JSON.stringify(variables),
                            status: "FAILED",
                            errorMessage: errorMessage,
                        },
                    });
                }
                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    await new Promise((r) => setTimeout(r, 1000 * attempt));
                }
            }
        }
        console.error(`❌ All ${retries} attempts failed for ${phoneNumber}. Last error: ${lastError}`);
        return false;
    },
    buildMessageBody(phoneNumber, templateName, variables) {
        const templateConfig = TEMPLATE_MAPPING[templateName];
        const paramNames = templateConfig.paramNames;
        // Build parameters array in order
        const parameters = paramNames.map((paramName) => ({
            type: "text",
            parameter_name: paramName,
            text: variables[paramName],
        }));
        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: "en",
                },
                components: [
                    {
                        type: "body",
                        parameters,
                    },
                ],
            },
        };
    },
    async sendOTP(phoneNumber, otp, brandId) {
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName: process.env.WHATSAPP_TEMPLATE_OTP,
            variables: {
                otp,
            },
            brandId,
        }, 2 // Retry once for OTP
        );
    },
    async sendPurchaseNotification(phoneNumber, restaurantName, points, brandId, isFirstPurchase = false) {
        const templateName = isFirstPurchase
            ? process.env.WHATSAPP_TEMPLATE_FIRST_PURCHASE
            : process.env.WHATSAPP_TEMPLATE_PURCHASE;
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName,
            variables: {
                restaurant_name: restaurantName,
                points: points.toString(),
            },
            brandId,
        }, 3 // Retry twice for purchase notification
        );
    },
    async sendRedemptionNotification(phoneNumber, restaurantName, redeemedCoins, earnedCoins, totalCoins, brandId) {
        return exports.whatsappService.sendMessage({
            phoneNumber,
            templateName: process.env.WHATSAPP_TEMPLATE_PURCHASE_REDEEM,
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
            templateName: process.env.WHATSAPP_TEMPLATE_EXPIRY_WARNING,
            variables: {
                restaurant_name: restaurantName,
                points: points.toString(),
                date: expiryDate,
            },
            brandId,
        }, 2);
    },
};
