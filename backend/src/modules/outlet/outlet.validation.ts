import { z } from "zod";

export const createOutletSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Outlet name is required").max(100),
    address: z.string().max(255).optional(),
    phoneNumber: z.string().max(20).optional(),
  }),
});

export type CreateOutletInput = z.infer<typeof createOutletSchema>["body"];
