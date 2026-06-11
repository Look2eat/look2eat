import axios, { AxiosError } from "axios";
import { prisma } from "../../prisma/client";
import { AppError } from "../../common/errors/AppError";
import { WhatsAppMessage } from "./types";
import { env } from "../../config/env";
import { TEMPLATE_MAPPING } from "./whatsapp.templates";


const WHATSAPP_API_URL =
  `https://graph.facebook.com/${env.whatsappApiVersion}/${env.whatsappPhoneNumberId}/messages`;

export const whatsappService = {
  formatPhoneNumber(phoneNumber: string): string {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length === 10) {
      return "91" + digits;
    }
    return digits;
  },

  async sendMessage(message: WhatsAppMessage, retries = 3): Promise<boolean> {
    const { phoneNumber, templateName, variables, brandId } = message;

    const templateConfig = TEMPLATE_MAPPING[templateName];
    if (!templateConfig) {
      throw new AppError(`Unknown template: ${templateName}`, 400);
    }

    const missingParams = templateConfig.paramNames.filter((p) => !variables[p]);
    if (missingParams.length > 0) {
      throw new AppError(
        `Missing template parameters: ${missingParams.join(", ")}`,
        400
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: { slug: true }
    });
    const brandSlug = brand?.slug || "app";

    const wallet = await prisma.coinWallet.findFirst({
      where: { phoneNumber, brandId },
      select: { id: true }
    });
    const walletId = wallet?.id || phoneNumber.replace(/^\+/, '');

    let lastError: unknown;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {

        const messageBody = whatsappService.buildMessageBody(
          phoneNumber,
          templateName,
          variables,
          brandSlug,
          walletId
        );

        console.log(`[WhatsApp Outbound] Sending template message to number format: ${messageBody.to}`);
        console.log(`[WhatsApp Outbound] Full Payload:`, JSON.stringify(messageBody, null, 2));

        const response = await axios.post(WHATSAPP_API_URL, messageBody, {
          headers: {
            Authorization: `Bearer ${env.whatsappAccessToken}`,
            "Content-Type": "application/json",
          },
        });

        const messageId = response.data?.messages?.[0]?.id;

        await prisma.whatsAppMessage.create({
          data: {
            brandId,
            phoneNumber: `+${whatsappService.formatPhoneNumber(phoneNumber)}`,
            templateName,
            variables: JSON.stringify(variables),
            status: "SENT",
            messageId,
            sentAt: new Date(),
          },
        });

        console.log(`WhatsApp message sent to ${phoneNumber}`);
        return true;

      } catch (error) {
        lastError = error;
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;
        const errorMessage = errorData?.error?.message || String(error);

        console.error(
          `❌ Attempt ${attempt}/${retries} failed for ${phoneNumber}: ${errorMessage}`
        );

        if (
          errorMessage.includes("not a valid") ||
          errorMessage.includes("no valid") ||
          errorMessage.includes("Invalid phone")
        ) {
          await prisma.whatsAppMessage.create({
            data: {
              brandId,
              phoneNumber: `+${whatsappService.formatPhoneNumber(phoneNumber)}`,
              templateName,
              variables: JSON.stringify(variables),
              status: "FAILED_INVALID_NUMBER",
              errorMessage,
            },
          });
          return false; 
        }

        if (attempt === retries) {
          await prisma.whatsAppMessage.create({
            data: {
              brandId,
              phoneNumber: `+${whatsappService.formatPhoneNumber(phoneNumber)}`,
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

    console.error(
      `❌ All ${retries} attempts failed for ${phoneNumber}. Last error: ${lastError}`
    );
    return false;
  },

  buildMessageBody(
    phoneNumber: string,
    templateName: string,
    variables: Record<string, string>,
    brandSlug: string,
    walletId: string
  ): any {
    const templateConfig = TEMPLATE_MAPPING[templateName];
    const paramNames = templateConfig.paramNames;
    const isOTP = templateName === env.whatsappTemplateOtp;

    const parameters = paramNames.map((paramName) => {
      const obj: any = {
        type: "text",
        text: variables[paramName],
      };
      if (!isOTP) {
        obj.parameter_name = paramName;
      }
      return obj;
    });

    const components: any[] = [
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
      to: whatsappService.formatPhoneNumber(phoneNumber), 
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

  async sendOTP(phoneNumber: string, otp: string, brandId: string) {
    return whatsappService.sendMessage(
      {
        phoneNumber,
        templateName: env.whatsappTemplateOtp,
        variables: {
          otp,
        },
        brandId,
      },
      2 
    );
  },

  async sendPurchaseNotification(
    phoneNumber: string,
    restaurantName: string,
    points: number,
    brandId: string,
    isNew: boolean
  ) {
    const templateName = env.whatsappTemplateFirstPurchase;

    return whatsappService.sendMessage(
      {
        phoneNumber,
        templateName,
        variables: {
          restaurant_name: restaurantName,
          points: points.toString(),
        },
        brandId,
      },
      3 
    );
  },

  async sendRedemptionNotification(
    phoneNumber: string,
    restaurantName: string,
    redeemedCoins: number,
    earnedCoins: number,
    totalCoins: number,
    brandId: string
  ) {
    return whatsappService.sendMessage(
      {
        phoneNumber,
        templateName:  env.whatsappTemplatePurchaseRedeem,
        variables: {
          restaurant_name: restaurantName,
          redeem: redeemedCoins.toString(),
          earned: earnedCoins.toString(),
          total: totalCoins.toString(),
        },
        brandId,
      },
      3
    );
  },

  async sendExpiryWarning(
    phoneNumber: string,
    restaurantName: string,
    points: number,
    expiryDate: string,
    brandId: string
  ) {
    return whatsappService.sendMessage(
      {
        phoneNumber,
        templateName: env.whatsappTemplateExpiryWarning,
        variables: {
          restaurant_name: restaurantName,
          points: points.toString(),
          date: expiryDate,
        },
        brandId,
      },
      2
    );
  },

  async sendTextMessage(phoneNumber: string, text: string): Promise<boolean> {
    try {
      const formattedNum = whatsappService.formatPhoneNumber(phoneNumber);
      console.log(`[WhatsApp Outbound] Sending text message to number format: ${formattedNum}`);
      await axios.post(
        WHATSAPP_API_URL,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedNum,
          type: "text",
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${env.whatsappAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ Text message sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;
      console.error(
        `❌ Failed to send text message to ${phoneNumber}:`,
        errorData?.error?.message || String(error)
      );
      return false;
    }
  },

  buildKnowMoreReply(
    brandName: string,
    currentCoins: number,
    coinRatioValue: number,
    milestones: { coinsRequired: number; cashbackAmount: number }[],
    publicUrl: string
  ): string {
    const milestoneLines = milestones
      .map((m) => {
        if (currentCoins >= m.coinsRequired) {
          return `✅ ${m.coinsRequired} coins  →  ₹${m.cashbackAmount} cashback`;
        } else {
          return `⬜ ${m.coinsRequired} coins  →  ₹${m.cashbackAmount} cashback`;
        }
      })
      .join("\n");

    return (
      `Welcome to *${brandName} Loyalty Program* 🎉\n\n` +
      `Thank you for choosing ${brandName}. Your loyalty means a lot to us.\n\n` +
      `💰 *Wallet Balance:* ${currentCoins} coins\n\n` +
      `📊 *Reward Milestones*\n\n` +
      `${milestoneLines}\n\n` +
      `📌 *How to Redeem*\n` +
      `Simply share your registered mobile number with our team and we'll process your cashback promptly.\n\n` +
      `🔗 *View Rewards Portal:*\n` +
      `${publicUrl}\n\n`
    );
  },
};
