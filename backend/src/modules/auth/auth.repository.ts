import { prisma } from "../../prisma/client";
import { Role } from "../../generated/prisma/enums";

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.adminUser.findUnique({
      where: { email },
    }),

  findBrandBySlug: (slug: string) =>
    prisma.brand.findUnique({
      where: { slug },
    }),

  createBrandAndOwner: async (data: {
    brandName: string;
    slug: string;
    ownerName: string;
    email: string;
    phone: string;
    passwordHash: string;
  }) => {
    return prisma.$transaction(async (tx) => {
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
          role: Role.OWNER,
        },
      });

      return { brand, owner };
    });
  },

  createUser: (data: {
    brandId?: string;
    email: string;
    name: string;
    passwordHash: string;
    phoneNumber: string;
    role: Role;
  }) =>
    prisma.adminUser.create({ data }),
};