import { Request, Response } from "express";

import { paymentService } from "./payment.service";
import { paymentValidation } from "./payment.validation";

export const paymentController = {
    async createOrder(
        req: Request,
        res: Response
    ) {
        const {
            outletId,
            type,
            planId,
            credits,
        } =
            paymentValidation.createOrder.parse(
                req.body
            );

        const order =
            await paymentService.createOrder(
                outletId,
                type,
                planId,
                credits
            );

        res.status(201).json({
            success: true,
            data: order,
        });
    },

    async verifyPayment(
        req: Request,
        res: Response
    ) {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } =
            paymentValidation.verifyPayment.parse(
                req.body
            );

        const payment =
            await paymentService.verifyPayment(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

        res.status(200).json({
            success: true,
            message:
                "Payment verified successfully",
            data: payment,
        });
    },
};