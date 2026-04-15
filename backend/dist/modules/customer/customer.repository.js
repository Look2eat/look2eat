"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRepository = void 0;
const client_1 = require("../../prisma/client");
exports.customerRepository = {
    getWalletWithHistory: (brandId, phone) => client_1.prisma.customer.findUnique({
        where: { brandId_phone: { brandId, phone } },
        include: {
            wallet: {
                include: {
                    transactions: {
                        orderBy: { createdAt: 'desc' },
                        take: 20
                    }
                }
            }
        }
    })
};
