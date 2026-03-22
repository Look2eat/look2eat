"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../common/middleware/validation.middleware");
const auth_middleware_1 = require("../../common/middleware/auth.middleware");
const auth_validation_1 = require("./auth.validation");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register-owner", (0, validation_middleware_1.validateRequest)(auth_validation_1.registerOwnerSchema), auth_controller_1.authController.registerOwner);
exports.authRouter.post("/login", (0, validation_middleware_1.validateRequest)(auth_validation_1.loginSchema), auth_controller_1.authController.login);
exports.authRouter.get("/me", auth_middleware_1.authenticateJwt, (0, auth_middleware_1.authorizeRoles)(["OWNER"]), (req, res) => {
    res.json({ data: req.auth });
});
