"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
function errorHandler(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            message: err.message,
            status: "error",
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        message: "Internal server error",
        status: "error",
    });
}
