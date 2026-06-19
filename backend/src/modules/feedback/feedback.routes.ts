import { Router } from "express";

import { validateRequest } from "../../common/middleware/validation.middleware";

import { feedbackController } from "./feedback.controller";
import { feedbackValidation } from "./feedback.validation";

const router = Router();

router.post(
  "/",
  validateRequest(
    feedbackValidation.submitFeedback
  ),
  feedbackController.submitFeedback
);

export { router as feedbackRouter };