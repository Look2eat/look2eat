function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  port: Number(process.env.PORT ?? 4000),

  databaseUrl: getEnv("DATABASE_URL"),

  jwtSecret: getEnv("JWT_SECRET"),

  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
//   WHATSAPP_API_URL :`https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
  whatsappAccessToken: getEnv("WHATSAPP_ACCESS_TOKEN"),
  whatsappPhoneNumberId: getEnv("WHATSAPP_PHONE_NUMBER_ID"),
  whatsappApiVersion: getEnv("WHATSAPP_API_VERSION"),
  whatsappTemplateOtp: getEnv("WHATSAPP_TEMPLATE_OTP"),
  whatsappTemplateFirstPurchase: getEnv("WHATSAPP_TEMPLATE_FIRST_PURCHASE"),
  whatsappTemplatePurchase: getEnv("WHATSAPP_TEMPLATE_PURCHASE"),
  whatsappTemplatePurchaseRedeem: getEnv("WHATSAPP_TEMPLATE_PURCHASE_REDEEM"),
  whatsappTemplateExpiryWarning: getEnv("WHATSAPP_TEMPLATE_EXPIRY_WARNING"),
};