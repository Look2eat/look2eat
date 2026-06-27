import AvgRating from "@/components/dashboard/feedback/AvgRating";
import { FeedbackCampaign } from "@/components/dashboard/feedback/FeedbackCampaign";
import ReviewsScroller from "@/components/dashboard/feedback/ReviewScroll";
import FeedbackStats from "@/components/shadcn-space/blocks/statistics-02/FeedbackStats";
import PageHeading from "@/components/dashboard/PageHeader";
import { FeedbackProvider } from "../../../lib/auth/FeedbackContext";

export default function FeedbackPage() {
    return (
        <FeedbackProvider>
            <div className="px-6 py-6 font-poppins gap-6 flex flex-col">
                <div>
                    <PageHeading />

                    <FeedbackStats />
                </div>
                <div className="flex gap-6">
                    <AvgRating />
                    <FeedbackCampaign />
                </div>
                <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
                    <ReviewsScroller />
                </div>
            </div>
        </FeedbackProvider>
    );
}