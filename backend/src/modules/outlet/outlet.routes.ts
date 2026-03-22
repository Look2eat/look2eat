import { Router } from "express";
import { outletController } from "./outlet.controller";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { authenticateJwt, authorizeRoles } from "../../common/middleware/auth.middleware";
import { createOutletSchema } from "./outlet.validation";
import { Role } from "../../generated/prisma/enums";

export const outletRouter = Router();

outletRouter.post(
  "/",
  authenticateJwt,
  authorizeRoles([Role.OWNER]),
  validateRequest(createOutletSchema),
  outletController.createOutlet
);

outletRouter.get(
  "/",
  authenticateJwt,
  authorizeRoles([Role.OWNER, Role.OUTLET_MANAGER]),
  outletController.getOutlets
);
