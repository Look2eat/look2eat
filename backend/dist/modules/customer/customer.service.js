"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const customer_repository_1 = require("./customer.repository");
exports.customerService = {
    getWalletDashboard: async (brandId, phone) => {
        const customer = await customer_repository_1.customerRepository.getWalletWithHistory(brandId, phone);
        if (!customer || !customer.wallet) {
            return null;
        }
        return {
            balance: customer.wallet.balance,
            transactions: customer.wallet.transactions,
        };
    }
};
