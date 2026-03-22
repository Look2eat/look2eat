import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./modules/auth/auth.routes";
import { outletRouter } from "./modules/outlet/outlet.routes";
import { errorHandler } from "./common/middleware/errorHandler.middleware";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan("tiny"));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/outlets", outletRouter);

  app.get("/debug", (_req, res) => res.json({ 
    databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
    databaseUrlValue: process.env.DATABASE_URL?.substring(0, 50) + "...",
    jwtSecret: process.env.JWT_SECRET ? "SET" : "NOT SET"
  }));

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use(errorHandler);

  return app;
}
