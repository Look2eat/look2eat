import { prisma } from "../../prisma/client";

export const outletRepository = {
  findByNameAndBrand: (name: string, brandId: string) =>
    prisma.outlet.findFirst({
      where: { name, brandId },
    }),

  createOutlet: (data: {
    brandId: string;
    name: string;
    address?: string;
    phoneNumber?: string;
  }) =>
    prisma.outlet.create({
      data,
    }),

  findByBrandId: (brandId: string) =>
    prisma.outlet.findMany({
      where: { brandId },
      orderBy: { createdAt: "desc" },
    }),
};
