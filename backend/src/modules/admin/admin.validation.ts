import { z } from "zod";

export const adminValidation = {
  setBrandCoinRatio: z.object({
    brandId: z.string().uuid(),
    coinRatioValue: z.number().positive("Coin ratio must be greater than 0"),
  }),

  createCashier: z.object({
    outletId: z.string().uuid(),
    phoneNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    name: z.string().min(2, "Name must be at least 2 characters"),
  }),

  createRewardMilestone: z.object({
    brandId: z.string().uuid(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    coinsRequired: z
      .number()
      .positive("Coins required must be greater than 0"),
    cashbackAmount: z
      .number()
      .positive("Cashback amount must be greater than 0"),
  }),

  updateRewardMilestone: z.object({
    coinsRequired: z
      .number()
      .positive("Coins required must be greater than 0")
      .optional(),
    cashbackAmount: z
      .number()
      .positive("Cashback amount must be greater than 0")
      .optional(),
  }),

  getTransactionHistory: z.object({
    brandId: z.string().uuid(),
    limit: z.number().int().positive().default(50),
    offset: z.number().int().nonnegative().default(0),
    customerPhone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits")
      .optional(),
    type: z.enum(["PURCHASE", "REDEMPTION"]).optional(),
    startDate: z
      .union([z.string().datetime(), z.instanceof(Date)])
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .optional(),
    endDate: z
      .union([z.string().datetime(), z.instanceof(Date)])
      .transform((val) => (typeof val === "string" ? new Date(val) : val))
      .optional(),
  }),
};
