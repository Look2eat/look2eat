import crypto from "crypto";

import {
  PaymentType,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../prisma/client";

import { AppError } from "../../common/errors/AppError";

import { razorpay } from "../../config/razorpay";

import { paymentRepository } from "./payment.repository";
import { subscriptionRepository } from "../subscription/subscription.repository";
import { subscriptionService } from "../subscription/subscription.service";
import { creditService } from "../credits/credit.service";

export const paymentService = {
  async createOrder(
    outletId: string,
    type: PaymentType,
    planId?: string,
    credits?: number
  ) {
    let amount = 0;
    let referenceId: string | undefined;

    if (type === "SUBSCRIPTION") {
      if (!planId) {
        throw new AppError(
          "Plan ID is required",
          400
        );
      }

      const plan =
        await subscriptionRepository.getPlanById(
          planId
        );

      if (!plan) {
        throw new AppError(
          "Subscription plan not found",
          404
        );
      }

      amount = plan.price * 100;
      referenceId = plan.id;
    }

    if (type === "CREDIT_PURCHASE") {
      if (!credits) {
        throw new AppError(
          "Credits are required",
          400
        );
      }

      amount = credits * 100;
      referenceId = credits.toString();
    }

    const order =
      await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

    await paymentRepository.createPayment({
      outletId,
      razorpayOrderId: order.id,
      amount,
      type,
      referenceId,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  },

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const payment =
      await paymentRepository.getPaymentByOrderId(
        razorpayOrderId
      );

    if (!payment) {
      throw new AppError(
        "Payment not found",
        404
      );
    }

    if (payment.status === "PAID") {
      return payment;
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET!
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpaySignature
    ) {
      throw new AppError(
        "Invalid payment signature",
        400
      );
    }

    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        if (
          payment.type === "SUBSCRIPTION"
        ) {
          if (!payment.referenceId) {
            throw new AppError(
              "Missing plan reference",
              500
            );
          }

          await subscriptionService.purchaseSubscription(
            payment.outletId,
            payment.referenceId,
            tx
          );
        }

        if (
          payment.type === "CREDIT_PURCHASE"
        ) {
          if (!payment.referenceId) {
            throw new AppError(
              "Missing credits reference",
              500
            );
          }

          await creditService.purchaseCredits(
            payment.outletId,
            Number(payment.referenceId),
            payment.amount / 100,
            tx
          );
        }

        return paymentRepository.markPaymentPaid(
          razorpayOrderId,
          razorpayPaymentId,
          tx
        );
      }
    );
  },
};