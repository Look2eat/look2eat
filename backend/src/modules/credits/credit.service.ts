import { Prisma } from "@prisma/client";

import { AppError } from "../../common/errors/AppError";
import { creditRepository } from "./credit.repository";

export const creditService = {
  async purchaseCredits(outletId: string, credits: number, amountPaid: number, tx?: Prisma.TransactionClient) {
    if (credits <= 0) {
      throw new AppError(
        "Credits must be greater than 0",
        400
      );
    }

    if (amountPaid <= 0) {
      throw new AppError(
        "Amount paid must be greater than 0",
        400
      );
    }

    let wallet =
      await creditRepository.getCreditWallet(
        outletId,
        tx
      );

    if (!wallet) {
      await creditRepository.createCreditWallet(
        outletId,
        tx
      );
    }

    return creditRepository.purchaseCredits(
      outletId,
      credits,
      amountPaid,
      tx
    );
  },

  async consumeCredits(outletId: string, credits: number, description?: string, tx?: Prisma.TransactionClient) {
    if (credits <= 0) {
      throw new AppError(
        "Credits must be greater than 0",
        400
      );
    }

    try {
      return await creditRepository.consumeCredits(
        outletId,
        credits,
        description,
        tx
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "Credit wallet not found"
      ) {
        throw new AppError(
          "Credit wallet not found",
          404
        );
      }

      if (
        error instanceof Error &&
        error.message ===
          "Insufficient credits"
      ) {
        throw new AppError(
          "Insufficient credits",
          400
        );
      }

      throw error;
    }
  },

  async getCreditBalance(outletId: string) {
    const wallet =
      await creditRepository.getCreditWallet(
        outletId
      );

    if (!wallet) {
      return {
        balance: 0,
        totalPurchased: 0,
        totalConsumed: 0,
      };
    }

    return wallet;
  },
};