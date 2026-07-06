import { publicClient } from "../http/publicClient";

export interface SubmitFeedbackPayload {
  walletId: string;
  rating: number;
  categories: string[];
  feedback?: string;
}

export interface SubmitFeedbackResponse {
  data: {
    id: string;
  };
}

export const submitFeedback = async (
  payload: SubmitFeedbackPayload
): Promise<SubmitFeedbackResponse> => {
  const res = await publicClient.post<SubmitFeedbackResponse>(
    "/feedback",
    payload
  );
  return res.data;
};

export const recordGoogleReviewClick = async (
  feedbackId: string
): Promise<void> => {
  await publicClient.patch(`/feedback/google-review/${feedbackId}`);
};