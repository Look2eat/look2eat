import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { authenticateJwt, authorizeRoles, AuthRequest } from "../../common/middleware/auth.middleware";
import { registerOwnerSchema, loginSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post(
  "/register-owner",
  validateRequest(registerOwnerSchema),
  authController.registerOwner
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  authController.login
);

authRouter.get(
  "/me",
  authenticateJwt,
  authorizeRoles(["OWNER"]),
  (req, res) => {
    res.json({ data: (req as AuthRequest).auth });
  }
);
