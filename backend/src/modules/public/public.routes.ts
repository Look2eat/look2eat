import express, { Router } from "express";
import { publicController } from "./public.controller";

export const publicRouter: Router = express.Router();

publicRouter.get(
  "/loyalty/:slug/:walletId",
  publicController.getLoyaltyPageData
);


publicRouter.get(
  "/loyalty/:slug",
  publicController.getBrandPublicData
);