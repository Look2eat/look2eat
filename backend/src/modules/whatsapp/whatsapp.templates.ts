import { env } from "../../config/env";

export const TEMPLATE_MAPPING: Record<string, { paramNames: string[] }> = {
  [env.whatsappTemplateOtp!]: {
    paramNames: ["otp"],
  },
  [env.whatsappTemplateFirstPurchase!]: {
    paramNames: ["restaurant_name", "points"],
  },
  [env.whatsappTemplatePurchase!]: {
    paramNames: ["restaurant_name", "points"],
  },
  [env.whatsappTemplatePurchaseRedeem!]: {
    paramNames: ["restaurant_name", "redeem", "earned", "total"],
  },
  [env.whatsappTemplateExpiryWarning!]: {
    paramNames: ["restaurant_name", "points", "date"],
  },
};