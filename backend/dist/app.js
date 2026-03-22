"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const outlet_routes_1 = require("./modules/outlet/outlet.routes");
const subscription_routes_1 = require("./modules/subscription/subscription.routes");
const errorHandler_middleware_1 = require("./common/middleware/errorHandler.middleware");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)("tiny"));
    app.use("/api/v1/auth", auth_routes_1.authRouter);
    app.use("/api/v1/outlets", outlet_routes_1.outletRouter);
    app.use("/api/v1/subscriptions", subscription_routes_1.subscriptionRouter);
    app.get("/debug", (_req, res) => res.json({
        databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
        databaseUrlValue: process.env.DATABASE_URL?.substring(0, 50) + "...",
        jwtSecret: process.env.JWT_SECRET ? "SET" : "NOT SET"
    }));
    app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
    app.use(errorHandler_middleware_1.errorHandler);
    return app;
}
