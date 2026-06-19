import { Router } from "express";

import { authenticateJwt } from "../../common/middleware/auth.middleware";
import { validateRequest } from "../../common/middleware/validation.middleware";

import { creditController } from "./credit.controller";
import { creditValidation } from "./credit.validation";

export const creditRouter = Router();

creditRouter.use(authenticateJwt);


creditRouter.post("/consume",validateRequest( creditValidation.consumeCredits ), creditController.consumeCredits);

creditRouter.get("/:outletId", creditController.getCreditBalance);