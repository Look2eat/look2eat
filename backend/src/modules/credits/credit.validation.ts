import { z } from "zod";

export const creditValidation = {
  consumeCredits: z.object({
    outletId: z.string().uuid(),

    credits: z
        .number()
        .int()
        .positive("Credits must be greater than 0"),

    description: z.string().optional(),
    }),
}