"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpController = void 0;
const otpStore_1 = require("./otpStore");
const wasender_service_1 = require("../messaging/wasender.service");
exports.otpController = {
    sendOtp: async (req, res, next) => {
        try {
            const { phone } = req.body;
            if (!phone) {
                return res.status(400).json({ error: "Phone number is required." });
            }
            const otp = otpStore_1.otpStore.generateAndStore(phone);
            const message = `Welcome to look2eat! Your login OTP is: ${otp}. It is valid for 5 minutes.`;
            const sent = await wasender_service_1.wasenderService.sendMessage(phone, message);
            if (!sent) {
                return res.status(500).json({ error: "Failed to send OTP message via WhatsApp. Please try again." });
            }
            return res.status(200).json({ message: "OTP sent successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { phone, otp } = req.body;
            if (!phone || !otp) {
                return res.status(400).json({ error: "Phone number and OTP are required." });
            }
            const isValid = otpStore_1.otpStore.verify(phone, otp);
            if (!isValid) {
                return res.status(400).json({ error: "Invalid or expired OTP." });
            }
            const successMessage = "Authentication successful! Your Zuplin wallet is active. Enjoy your rewards!";
            await wasender_service_1.wasenderService.sendMessage(phone, successMessage);
            return res.status(200).json({
                message: "OTP verified successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
};
