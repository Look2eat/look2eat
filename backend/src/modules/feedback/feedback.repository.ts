import { prisma } from "../../prisma/client";

export const feedbackRepository = {
  async getTransaction(
    transactionId: string
  ) {
    return prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        wallet: {
          include: {
            brand: true,
          },
        },
        outlet: true,
      },
    });
  },

  async findByTransaction(
    transactionId: string
  ) {
    return prisma.customerFeedback.findUnique({
      where: {
        transactionId,
      },
    });
  },

  async createFeedback(data: {
    transactionId: string;
    brandId: string;
    outletId: string;
    phoneNumber: string;
    rating: number;
    feedback?: string;
  }) {
    return prisma.customerFeedback.create({
      data,
    });
  },

  async getOutlet(
    outletId: string
  ) {
    return prisma.outlet.findUnique({
      where: {
        id: outletId,
      },
      select: {
        id: true,
        name: true,
        googleReviewUrl: true,
        managerWhatsappNumber: true,
      },
    });
  },

  async getFeedbackByOutlet(
    outletId: string
  ) {
    return prisma.customerFeedback.findMany({
      where: {
        outletId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};