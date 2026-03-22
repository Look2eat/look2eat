"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const client_1 = require("../../prisma/client");
const enums_1 = require("../../generated/prisma/enums");
exports.authRepository = {
    findByEmail: (email) => client_1.prisma.adminUser.findUnique({
        where: { email },
    }),
    findBrandBySlug: (slug) => client_1.prisma.brand.findUnique({
        where: { slug },
    }),
    createBrandAndOwner: async (data) => {
        return client_1.prisma.$transaction(async (tx) => {
            const brand = await tx.brand.create({
                data: {
                    name: data.brandName,
                    slug: data.slug,
                    email: data.email,
                    phoneNumber: data.phone,
                },
            });
            const owner = await tx.adminUser.create({
                data: {
                    brandId: brand.id,
                    name: data.ownerName,
                    email: data.email,
                    phoneNumber: data.phone,
                    passwordHash: data.passwordHash,
                    role: enums_1.Role.OWNER,
                },
            });
            return { brand, owner };
        });
    },
    createUser: (data) => client_1.prisma.adminUser.create({ data }),
};
