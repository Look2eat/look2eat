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
};