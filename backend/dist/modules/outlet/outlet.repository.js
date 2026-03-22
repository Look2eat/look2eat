"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outletRepository = void 0;
const client_1 = require("../../prisma/client");
exports.outletRepository = {
    findByNameAndBrand: (name, brandId) => client_1.prisma.outlet.findFirst({
        where: { name, brandId },
    }),
    createOutlet: (data) => client_1.prisma.outlet.create({
        data,
    }),
    findByBrandId: (brandId) => client_1.prisma.outlet.findMany({
        where: { brandId },
        orderBy: { createdAt: "desc" },
    }),
};
