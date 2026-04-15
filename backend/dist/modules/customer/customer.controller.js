"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const customer_service_1 = require("./customer.service");
exports.customerController = {
    getDashboard: async (req, res, next) => {
        try {
            const phone = req.params.phone;
            const auth = req.auth;
            if (!auth || !auth.brandId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            // For MVP, customer routes might be protected by OTP tokens which have brandId and phone, 
            // or we can allow the UI to freely query by phone if the user is authenticated generally.
            const dashboard = await customer_service_1.customerService.getWalletDashboard(auth.brandId, phone);
            if (!dashboard) {
                return res.status(404).json({ message: "No wallet found for this customer." });
            }
            return res.status(200).json({ dashboard });
        }
        catch (error) {
            next(error);
        }
    }
};
