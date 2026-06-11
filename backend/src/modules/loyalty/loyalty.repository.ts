import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/AppError";
import { prisma } from "../../prisma/client";
import { DEFAULT_EXPIRY_DAYS } from "./loyalty.constants";


export const loyaltyRepository = {
  async getOrCreateCoinWallet(
    customerPhoneNumber: string,
    brandId: string
  ) {
    let wallet = await prisma.coinWallet.findUnique({
      where: {
        brandId_phoneNumber: {
          brandId,
          phoneNumber: customerPhoneNumber,
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.coinWallet.create({
        data: {
          phoneNumber: customerPhoneNumber,
          brandId,
          currentCoins: 0,
          expiryDate: new Date(
            Date.now() +
              DEFAULT_EXPIRY_DAYS *
                24 *
                60 *
                60 *
                1000
          ),
        },
      });
    }

    return wallet;
  },

  async getCustomerWalletWithMilestones(
    customerPhoneNumber: string,
    brandId: string
  ) {
    const wallet =
      await loyaltyRepository.getOrCreateCoinWallet(
        customerPhoneNumber,
        brandId
      );

    const milestones =
      await prisma.rewardMilestone.findMany({
        where: {
          brandId,
          isActive: true,
        },
        orderBy: {
          coinsRequired: "asc",
        },
      });

    return {
      wallet,
      milestones,
    };
  },

  async isNewCustomer(
    customerPhoneNumber: string,
    brandId: string
  ): Promise<boolean> {
    const transaction =
      await prisma.transaction.findFirst({
        where: {
          wallet: {
            phoneNumber: customerPhoneNumber,
            brandId,
          },
        },
      });

    return !transaction;
  },

  async getBrandSettings(brandId: string) {
    return prisma.brandSettings.findUnique({
      where: { brandId },
    });
  },

  async getRewardMilestoneById(
    milestoneId: string
  ) {
    return prisma.rewardMilestone.findUnique({
      where: { id: milestoneId },
    });
  },

  async getBrandName(
    brandId: string
  ): Promise<string | null> {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        name: true,
      },
    });

    return brand?.name ?? null;
  },

  async recordPurchaseTransaction(
    customerPhoneNumber: string,
    brandId: string,
    purchaseAmount: number,
    coinsEarned: number,
    cashierPhoneNumber: string
  ) {
    const wallet =
      await loyaltyRepository.getOrCreateCoinWallet(
        customerPhoneNumber,
        brandId
      );

    const transaction =
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "PURCHASE",
          purchaseAmount,
          coinsEarned,
          cashierPhoneNumber,
        },
      });

    const updatedWallet =
      await prisma.coinWallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          currentCoins: {
            increment: coinsEarned,
          },
          totalCoinsEarned: {
            increment: coinsEarned,
          },
          expiryDate: new Date(
            Date.now() +
              DEFAULT_EXPIRY_DAYS *
                24 *
                60 *
                60 *
                1000
          ),
        },
      });

    return {
      transaction,
      wallet: updatedWallet,
    };
  },

  async redeemAndPurchase(
    customerPhoneNumber: string,
    brandId: string,
    milestoneId: string,
    coinsRedeemed: number,
    cashbackApplied: number,
    purchaseAmount: number,
    coinsEarned: number,
    cashierPhoneNumber: string
  ) {
    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const wallet =
          await tx.coinWallet.findUnique({
            where: {
              brandId_phoneNumber: {
                brandId,
                phoneNumber:
                  customerPhoneNumber,
              },
            },
          });

        if (!wallet) {
          throw new AppError(
            "Wallet not found",
            404
          );
        }

        const redemptionTransaction =
          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              type: "REDEMPTION",
              coinsRedeemed,
              cashbackApplied,
              milestoneId,
              cashierPhoneNumber,
            },
          });

        await tx.coinWallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            currentCoins: {
              decrement: coinsRedeemed,
            },
          },
        });

        const purchaseTransaction =
          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              type: "PURCHASE",
              purchaseAmount,
              coinsEarned,
              cashierPhoneNumber,
            },
          });

        const updatedWallet =
          await tx.coinWallet.update({
            where: {
              id: wallet.id,
            },
            data: {
              currentCoins: {
                increment: coinsEarned,
              },
              totalCoinsEarned: {
                increment: coinsEarned,
              },
              expiryDate: new Date(
                Date.now() +
                  DEFAULT_EXPIRY_DAYS *
                    24 *
                    60 *
                    60 *
                    1000
              ),
            },
          });

        return {
          redemptionTransaction,
          purchaseTransaction,
          wallet: updatedWallet,
        };
      }
    );
  },
};