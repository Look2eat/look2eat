"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerOwnerSchema = void 0;
const zod_1 = require("zod");
exports.registerOwnerSchema = zod_1.z.object({
    body: zod_1.z.object({
        brandName: zod_1.z.string().min(1, "Brand name is required").max(100),
        slug: zod_1.z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
        name: zod_1.z.string().min(1, "Owner name is required").max(100),
        email: zod_1.z.string().email("Invalid email").toLowerCase(),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
        phone: zod_1.z.string().min(10, "Phone number too short").max(15, "Phone number too long"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
