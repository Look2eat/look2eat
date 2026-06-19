import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { authRouter } from "./modules/auth/auth.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { outletRouter } from "./modules/outlet/outlet.routes";
import { cashierRouter } from "./modules/cashier/cashier.routes";
import { publicRouter } from "./modules/public/public.routes";
import { subscriptionRouter } from "./modules/subscription/subscription.routes";
import { creditRouter } from "./modules/credits/credit.routes";
import {feedbackRouter} from "./modules/feedback/feedback.routes";
import { paymentRouter } from "./modules/payment/payment.routes";

import { errorHandler } from "./common/middleware/errorHandler.middleware";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use((req, _res, next) => {
  console.log("CONTENT TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  next();
}); 
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan("tiny"));

  app.use("/api/v1/auth", authRouter);

  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/outlets", outletRouter);
  app.use("/api/v1/cashier", cashierRouter);
  app.use("/api/v1/feedback", feedbackRouter);
  app.use("/api/v1/subscriptions", subscriptionRouter);
  app.use("/api/v1/credits",creditRouter);
  app.use("/api/v1/public", publicRouter);
  app.use("/api/v1/payments", paymentRouter);

  app.get("/health", (_req, res) =>
    res.status(200).json({ status: "ok" })
  );

  app.use(errorHandler);

  return app;
}