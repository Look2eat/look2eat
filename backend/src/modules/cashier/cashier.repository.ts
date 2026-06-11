import { prisma } from "../../prisma/client";

export const cashierRepository = {
  async createCashierSession(
    cashierId: string,
    otp: string,
    expiresAt: Date
  ) {
    return prisma.cashierSession.create({
      data: {
        cashierId,
        otp,
        otpExpiresAt: expiresAt,
      },
    });
  },

  async getCashierSessionByPhone(
    cashierPhoneNumber: string,
    outletId: string
  ) {
    const cashier = await prisma.cashier.findUnique({
      where: {
        outletId_phoneNumber: {
          outletId,
          phoneNumber: cashierPhoneNumber,
        },
      },
    });

    if (!cashier) {
      return null;
    }

    return prisma.cashierSession.findFirst({
      where: {
        cashierId: cashier.id,
        otpExpiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateCashierSessionVerified(
    sessionId: string,
    verifiedAt: Date
  ) {
    return prisma.cashierSession.update({
      where: {
        id: sessionId,
      },
      data: {
        verifiedAt,
      },
    });
  },

  async getCashierByPhoneAndOutlet(
    phoneNumber: string,
    outletId: string
  ) {
    return prisma.cashier.findUnique({
      where: {
        outletId_phoneNumber: {
          outletId,
          phoneNumber,
        },
      },
      include: {
        outlet: {
          select: {
            id: true,
            brandId: true,
            name: true,
          },
        },
      },
    });
  },

  async createCustomerOTPSession(
    customerPhoneNumber: string,
    otp: string,
    expiresAt: Date,
    brandId: string
  ) {
    return prisma.customerOTPSession.create({
      data: {
        phoneNumber: customerPhoneNumber,
        otp,
        expiresAt,
        brandId,
        verified: false,
      },
    });
  },

  async getCustomerOTPSession(
    customerPhoneNumber: string,
    brandId: string
  ) {
    return prisma.customerOTPSession.findFirst({
      where: {
        phoneNumber: customerPhoneNumber,
        brandId,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async markCustomerOTPVerified(sessionId: string) {
    return prisma.customerOTPSession.update({
      where: {
        id: sessionId,
      },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });
  },

  async hasRecentVerifiedSession(
    customerPhoneNumber: string,
    brandId: string
  ): Promise<boolean> {
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000
    );

    const session =
      await prisma.customerOTPSession.findFirst({
        where: {
          phoneNumber: customerPhoneNumber,
          brandId,
          verified: true,
          verifiedAt: {
            gte: fifteenMinutesAgo,
          },
        },
      });

    return Boolean(session);
  },
};