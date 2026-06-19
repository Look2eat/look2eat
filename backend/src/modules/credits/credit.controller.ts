import { Request, Response } from "express";

import { AppError } from "../../common/errors/AppError";
import { creditService } from "./credit.service";
import { creditValidation } from "./credit.validation";

export const creditController = {

    async consumeCredits(req: Request, res: Response) {
        const {
            outletId,
            credits,
            description,
        } =
            creditValidation.consumeCredits.parse(
                req.body
            );

        const wallet =
            await creditService.consumeCredits(
                outletId,
                credits,
                description
            );

        res.status(200).json({
            message:
                "Credits consumed successfully",
            data: wallet,
        });
    },

    async getCreditBalance(req: Request, res: Response) {
        const { outletId } = req.params;

        if (!outletId || Array.isArray(outletId)) {
            throw new AppError(
                "Outlet ID is required",
                400
            );
        }

        const wallet =
            await creditService.getCreditBalance(
                outletId
            );

        res.status(200).json({
            data: wallet,
        });
    },
};