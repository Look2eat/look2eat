import {
    CreditTransactionType,
    Prisma,
} from "@prisma/client";

import { prisma } from "../../prisma/client";

export const creditRepository = {
    async getCreditWallet(outletId: string, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        return db.platformCreditWallet.findUnique({
            where: {
                outletId,
            },
        });
    },

    async createCreditWallet(outletId: string, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        return db.platformCreditWallet.create({
            data: {
                outletId,
            },
        });
    },

    async purchaseCredits(outletId: string, credits: number, amountPaid: number, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        const wallet =
            await db.platformCreditWallet.update({
                where: {
                    outletId,
                },
                data: {
                    balance: {
                        increment: credits,
                    },
                    totalPurchased: {
                        increment: credits,
                    },
                },
            });

        await db.creditTransaction.create({
            data: {
                outletId,
                type: CreditTransactionType.PURCHASE,
                credits,
                amountPaid,
                description: `Purchased ${credits} credits`,
            },
        });

        return wallet;
    },

    async consumeCredits(outletId: string, credits: number, description?: string, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        const wallet =
            await db.platformCreditWallet.findUnique({
                where: {
                    outletId,
                },
            });

        if (!wallet) {
            throw new Error(
                "Credit wallet not found"
            );
        }

        if (wallet.balance < credits) {
            throw new Error(
                "Insufficient credits"
            );
        }

        const updatedWallet =
            await db.platformCreditWallet.update({
                where: {
                    outletId,
                },
                data: {
                    balance: {
                        decrement: credits,
                    },
                    totalConsumed: {
                        increment: credits,
                    },
                },
            });

        await db.creditTransaction.create({
            data: {
                outletId,
                type:
                    CreditTransactionType.CONSUMPTION,
                credits,
                description:
                    description ??
                    "Credits consumed",
            },
        });

        return updatedWallet;
    },

    async createCreditTransaction(outletId: string, type: CreditTransactionType, credits: number, amountPaid?: number, description?: string, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        return db.creditTransaction.create({
            data: {
                outletId,
                type,
                credits,
                amountPaid,
                description,
            },
        });
    },

    async canConsumeCredits(outletId: string, credits: number, creditLimit: number) {
        const wallet =
            await prisma.platformCreditWallet.findUnique({
                where: {
                    outletId,
                },
            });

        if (!wallet) {
            return false;
        }

        return (
            wallet.balance - credits >=
            creditLimit
        );
    },

    async consumeCreditsAllowNegative(outletId: string, credits: number, description: string, tx?: Prisma.TransactionClient) {
        const db = tx ?? prisma;

        const wallet =
            await db.platformCreditWallet.update({
                where: {
                    outletId,
                },
                data: {
                    balance: {
                        decrement: credits,
                    },
                    totalConsumed: {
                        increment: credits,
                    },
                },
            });

        await db.creditTransaction.create({
            data: {
                outletId,
                type:
                    CreditTransactionType.CONSUMPTION,
                credits,
                description,
            },
        });

        return wallet;
    },
};