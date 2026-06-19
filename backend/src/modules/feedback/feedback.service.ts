import { AppError } from "../../common/errors/AppError";
import { feedbackRepository } from "./feedback.repository";

export const feedbackService = {
  async createFeedback(
    transactionId: string,
    rating: number,
    feedback?: string
  ) {
    const transaction =
      await feedbackRepository.getTransaction(
        transactionId
      );

    if (!transaction) {
      throw new AppError(
        "Transaction not found",
        404
      );
    }

    if (transaction.type !== "PURCHASE") {
      throw new AppError(
        "Feedback allowed only for purchase transactions",
        400
      );
    }

    const existingFeedback =
      await feedbackRepository.findByTransaction(
        transactionId
      );

    if (existingFeedback) {
      throw new AppError(
        "Feedback already submitted",
        400
      );
    }

    if (!transaction.outletId) {
      throw new AppError(
        "Transaction outlet not found",
        500
      );
    }

    const outlet =
      await feedbackRepository.getOutlet(
        transaction.outletId
      );

    if (!outlet) {
      throw new AppError(
        "Outlet not found",
        404
      );
    }

    const createdFeedback =
      await feedbackRepository.createFeedback({
        transactionId,
        brandId: transaction.wallet.brandId,
        outletId: transaction.outletId,
        phoneNumber:
          transaction.wallet.phoneNumber,
        rating,
        feedback,
      });

    if (rating >= 4) {
      return {
        feedback: createdFeedback,
        redirectToGoogle: true,
        googleReviewUrl:
          outlet.googleReviewUrl,
      };
    }

    return {
      feedback: createdFeedback,
      redirectToGoogle: false,
      message:
        "Feedback submitted successfully",
    };
  },
};