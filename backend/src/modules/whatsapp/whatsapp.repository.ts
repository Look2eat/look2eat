import { prisma } from "../../prisma/client";

export const whatsappRepository = {
  async createWhatsappCycle(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.create({
      data: {
        transactionId,
      },
    });
  },

  async getCycleByTransactionId(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.findUnique({
      where: {
        transactionId,
      },
    });
  },

  async markPurchaseMessageSent(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.update({
      where: {
        transactionId,
      },
      data: {
        purchaseMessageSent: true,
      },
    });
  },

  async markReminder1Sent(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.update({
      where: {
        transactionId,
      },
      data: {
        reminder1Sent: true,
        reminder1SentAt: new Date(),
      },
    });
  },

  async markReminder2Sent(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.update({
      where: {
        transactionId,
      },
      data: {
        reminder2Sent: true,
        reminder2SentAt: new Date(),
      },
    });
  },

  async markExpirySent(
    transactionId: string
  ) {
    return prisma.whatsAppCycle.update({
      where: {
        transactionId,
      },
      data: {
        expirySent: true,
        expirySentAt: new Date(),
      },
    });
  },
};