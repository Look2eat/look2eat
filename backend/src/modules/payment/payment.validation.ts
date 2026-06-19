import { z } from "zod";

export const paymentValidation = {
  createOrder: z.object({
    outletId: z.string().uuid(),

    type: z.enum([
      "SUBSCRIPTION",
      "CREDIT_PURCHASE",
    ]),

    planId: z.string().uuid().optional(),

    credits: z.number().int().positive().optional(),
  }),

  verifyPayment: z.object({
    razorpay_order_id: z.string(),

    razorpay_payment_id: z.string(),

    razorpay_signature: z.string(),
  }),
};