import { z } from "zod";

export const subscriptionValidation = {
  createPlan: z.object({
    name: z.string().min(2, "Plan name is required"),

    durationMonths: z
      .number()
      .int()
      .positive("Duration must be greater than 0"),

    price: z
      .number()
      .int()
      .positive("Price must be greater than 0"),
  }),

  purchaseSubscription: z.object({
    outletId: z.string().uuid(),

    planId: z.string().uuid(),
  }),

  purchaseCredits: z.object({
    outletId: z.string().uuid(),

    credits: z
      .number()
      .int()
      .positive("Credits must be greater than 0"),

    amountPaid: z
      .number()
      .int()
      .positive("Amount paid must be greater than 0"),
  }),

  consumeCredits: z.object({
    outletId: z.string().uuid(),

    credits: z
      .number()
      .int()
      .positive("Credits must be greater than 0"),

    description: z.string().optional(),
  }),
};