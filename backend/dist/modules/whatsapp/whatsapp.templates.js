"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_MAPPING = void 0;
const env_1 = require("../../config/env");
exports.TEMPLATE_MAPPING = {
    [env_1.env.whatsappTemplateOtp]: {
        paramNames: ["otp"],
    },
    [env_1.env.whatsappTemplateFirstPurchase]: {
        paramNames: ["restaurant_name", "points"],
    },
    [env_1.env.whatsappTemplatePurchase]: {
        paramNames: ["restaurant_name", "points"],
    },
    [env_1.env.whatsappTemplatePurchaseRedeem]: {
        paramNames: ["restaurant_name", "redeem", "earned", "total"],
    },
    [env_1.env.whatsappTemplateExpiryWarning]: {
        paramNames: ["restaurant_name", "points", "date"],
    },
};
