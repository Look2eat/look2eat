import axios, { AxiosError } from "axios";
import { prisma } from "../../prisma/client";
import { AppError } from "../errors/AppError";

interface WhatsAppTemplateVariable {
  type: "text";
  parameter_name?: string;
  text: string;
}

interface WhatsAppMessage {
  phoneNumber: string;
  templateName: string;
  variables: Record<string, string>;
  brandId: string;
}

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const TEMPLATE_MAPPING: Record<string, { paramNames: string[] }> = {
  [process.env.WHATSAPP_TEMPLATE_OTP!]: {
    paramNames: ["otp"],
  },
  [process.env.WHATSAPP_TEMPLATE_FIRST_PURCHASE!]: {
    paramNames: ["restaurant_name", "points"],
  },
  [process.env.WHATSAPP_TEMPLATE_PURCHASE!]: {
    paramNames: ["restaurant_name", "points"],
  },
  [process.env.WHATSAPP_TEMPLATE_PURCHASE_REDEEM!]: {
    paramNames: ["restaurant_name", "redeem", "earned", "total"],
  },
  [process.env.WHATSAPP_TEMPLATE_EXPIRY_WARNING!]: {
    paramNames: ["restaurant_name", "points", "date"],
  },
};

export const whatsappService = {
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

    let lastError: any;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {

        const messageBody = whatsappService.buildMessageBody(
          phoneNumber,
          templateName,
          variables,
          brandSlug,
          walletId
        );

        const response = await axios.post(WHATSAPP_API_URL, messageBody, {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const messageId = response.data?.messages?.[0]?.id;

        await prisma.whatsAppMessage.create({
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
        console.log(messageBody);
        console.log(response);
        console.log(
          `✅ WhatsApp message sent to ${phoneNumber} (templateId: ${messageId})`
        );
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
              phoneNumber: phoneNumber.startsWith("+")
                ? phoneNumber
                : `+${phoneNumber}`,
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
    const isOTP = templateName === process.env.WHATSAPP_TEMPLATE_OTP;

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
      to: phoneNumber.replace(/^\+/, ''), 
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
        templateName: process.env.WHATSAPP_TEMPLATE_OTP!,
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
    isFirstPurchase: boolean = false
  ) {
    const templateName = isFirstPurchase
      ? process.env.WHATSAPP_TEMPLATE_FIRST_PURCHASE!
      : process.env.WHATSAPP_TEMPLATE_PURCHASE!;

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
        templateName: process.env.WHATSAPP_TEMPLATE_PURCHASE_REDEEM!,
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
        templateName: process.env.WHATSAPP_TEMPLATE_EXPIRY_WARNING!,
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
};
