import { z } from "zod";

export const registerOwnerSchema = z.object({
  body: z.object({
    brandName: z.string().min(1, "Brand name is required").max(100),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    name: z.string().min(1, "Owner name is required").max(100),
    email: z.string().email("Invalid email").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(10, "Phone number too short").max(15, "Phone number too long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
