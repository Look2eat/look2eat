import { z } from "zod";

export const feedbackValidation = {
  submitFeedback: z.object({
    transactionId: z.string().uuid(),

    rating: z
      .number()
      .int()
      .min(1)
      .max(5),

    feedback: z
      .string()
      .max(1000)
      .optional(),
  }),
};