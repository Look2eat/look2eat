"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wasenderService = void 0;
exports.wasenderService = {
    formatPhone: (phone) => {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            cleaned = '91' + cleaned;
        }
        else if (cleaned.startsWith('0')) {
            cleaned = '91' + cleaned.substring(1);
        }
        return cleaned;
    },
    sendMessage: async (phone, message) => {
        const wasenderToken = process.env.WASENDER_TOKEN;
        const wasenderUrl = process.env.WASENDER_URL || "https://api.wasender.com/api/send-message"; // Example URL if user specifies it
        if (!wasenderToken) {
            console.log(`\n[WASENDER MOCK] -> Sending to ${phone}:\n${message}\n`);
            return true;
        }
        const formattedPhone = exports.wasenderService.formatPhone(phone);
        try {
            const response = await fetch(wasenderUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${wasenderToken}`
                },
                body: JSON.stringify({
                    to: formattedPhone,
                    message: message
                }),
            });
            if (!response.ok) {
                const errObj = await response.json().catch(() => ({}));
                console.error("[Wasender] Error sending message:", errObj);
                return false;
            }
            console.log(`[Wasender] Message sent to ${formattedPhone} successfully.`);
            return true;
        }
        catch (error) {
            console.error("[Wasender] Failed to execute HTTP request:", error);
            return false;
        }
    }
};
