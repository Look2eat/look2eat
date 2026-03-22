"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const AppError_1 = require("../errors/AppError");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req);
            next();
        }
        catch (error) {
            const message = error.errors?.[0]?.message || "Validation failed";
            throw new AppError_1.AppError(message, 400);
        }
    };
}
