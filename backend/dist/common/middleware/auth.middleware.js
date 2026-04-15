"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = authenticateJwt;
exports.authorizeRoles = authorizeRoles;
exports.requireOutletScope = requireOutletScope;
exports.authenticateCashierJwt = authenticateCashierJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../errors/AppError");
function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError_1.AppError("Missing authorization token", 401);
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new AppError_1.AppError("JWT_SECRET is not set", 500);
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.auth = payload;
        next();
    }
    catch (err) {
        throw new AppError_1.AppError("Invalid or expired token", 401);
    }
}
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        const auth = req.auth;
        if (!auth)
            throw new AppError_1.AppError("Unauthorized", 401);
        if (!allowedRoles.includes(auth.role)) {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        next();
    };
}
function requireOutletScope(req, res, next) {
    const auth = req.auth;
    if (!auth?.outletId) {
        throw new AppError_1.AppError("Outlet scope is required", 403);
    }
    next();
}
function authenticateCashierJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError_1.AppError("Missing authorization token", 401);
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new AppError_1.AppError("JWT_SECRET is not set", 500);
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.cashierAuth = payload;
        next();
    }
    catch (err) {
        throw new AppError_1.AppError("Invalid or expired token", 401);
    }
}
