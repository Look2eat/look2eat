"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutletSchema = void 0;
const zod_1 = require("zod");
exports.createOutletSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Outlet name is required").max(100),
        address: zod_1.z.string().max(255).optional(),
        phoneNumber: zod_1.z.string().max(20).optional(),
    }),
});
