import { Request, Response } from "express";

import { feedbackService } from "./feedback.service";

export const feedbackController = {
  async submitFeedback(
    req: Request,
    res: Response
  ) {
    const {
      transactionId,
      rating,
      feedback,
    } = req.body;

    const result =
      await feedbackService.createFeedback(
        transactionId,
        rating,
        feedback
      );

    res.status(201).json({
      success: true,
      message:
        "Feedback submitted successfully",
      data: result,
    });
  },
};