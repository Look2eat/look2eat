import { Router } from "express";

import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create-order", paymentController.createOrder);

router.post("/verify", paymentController.verifyPayment);

export { router as paymentRouter };