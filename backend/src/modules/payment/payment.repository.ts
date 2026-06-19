import {
  PaymentStatus,
  PaymentType,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../prisma/client";

export const paymentRepository = {
  async createPayment(data: {
    outletId: string;
    razorpayOrderId: string;
    amount: number;
    type: PaymentType;
    referenceId?: string;
  }) {
    return prisma.payment.create({
      data,
    });
  },

  async getPaymentByOrderId(
    razorpayOrderId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.payment.findUnique({
      where: {
        razorpayOrderId,
      },
    });
  },

  async markPaymentPaid(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.payment.update({
      where: {
        razorpayOrderId,
      },
      data: {
        razorpayPaymentId,
        status: PaymentStatus.PAID,
      },
    });
  },

  async markPaymentFailed(
    razorpayOrderId: string,
    tx?: Prisma.TransactionClient
  ) {
    const db = tx ?? prisma;

    return db.payment.update({
      where: {
        razorpayOrderId,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  },
};