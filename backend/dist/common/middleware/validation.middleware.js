"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
const AppError_1 = require("../errors/AppError");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            console.log("VALIDATION ERROR:", error);
            if (error instanceof zod_1.ZodError) {
                throw new AppError_1.AppError(error.issues[0]?.message ?? "Validation failed", 400);
            }
            throw error;
        }
    };
}
