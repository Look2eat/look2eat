"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const public_controller_1 = require("./public.controller");
exports.publicRouter = express_1.default.Router();
exports.publicRouter.get("/loyalty/:slug/:walletId", public_controller_1.publicController.getLoyaltyPageData);
exports.publicRouter.get("/loyalty/:slug", public_controller_1.publicController.getBrandPublicData);
exports.publicRouter.get("/webhook/whatsapp", public_controller_1.publicController.verifyWebhook);
exports.publicRouter.post("/webhook/whatsapp", public_controller_1.publicController.handleWebhook);
