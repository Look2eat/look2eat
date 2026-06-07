import { Scroller } from "@/components/ui/scroller-1";
import { Star } from "lucide-react";

type Review = {
    id: string;
    rating: number;
    reviewerName: string;
    dateTime: string;
    review: string;
};

const reviews: Review[] = [
    {
        id: "1",
        rating: 5,
        reviewerName: "John Smith",
        dateTime: "15 Jun 2026 • 10:30 AM",
        review:
            "Amazing experience. The staff was extremely helpful and the service exceeded expectations.",
    },
    {
        id: "2",
        rating: 2,
        reviewerName: "Sarah Wilson",
        dateTime: "14 Jun 2026 • 04:15 PM",
        review:
            "Delivery was delayed and communication was poor. Expected a much smoother experience.",
    },
    {
        id: "3",
        rating: 3,
        reviewerName: "Michael Brown",
        dateTime: "13 Jun 2026 • 01:20 PM",
        review:
            "Overall okay. Some areas were good but there is definitely room for improvement.",
    },
    {
        id: "4",
        rating: 1,
        reviewerName: "Emma Davis",
        dateTime: "12 Jun 2026 • 08:45 AM",
        review:
            "Very disappointed. Multiple issues occurred and support was unresponsive.",
    },
    {
        id: "5",
        rating: 4,
        reviewerName: "David Miller",
        dateTime: "11 Jun 2026 • 06:10 PM",
        review:
            "Great quality and professional service. Would happily recommend it.",
    },
];

const getRatingColor = (rating: number) => {
    if (rating <= 2) return "bg-red-400/80";
    if (rating === 3) return "bg-yellow-400/80";
    return "bg-green-400/80";
};

export default function ReviewsScroller() {
    return (
        <div className="space-y-4 bg-white dark:bg-[#121214] p-4 md:p-6 rounded-2xl font-poppins w-full overflow-hidden">
            <div>
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <p className="text-sm text-muted-foreground">
                    Customer feedback and ratings
                </p>
            </div>

            <Scroller height="100%" overflow="x" width="100%" >
                <div className="flex gap-4 w-max pb-2">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="relative flex  w-90 flex-col overflow-hidden rounded-xl border bg-background shadow-sm"
                        >
                            {/* Rating color bar */}
                            <div
                                className={`absolute left-0 top-0 h-full w-2 ${getRatingColor(
                                    review.rating
                                )}`}
                            />

                            <div className="flex h-full flex-col p-5 pl-6">
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">
                                            {review.reviewerName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {review.dateTime}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-full bg-white dark:bg-[#121214] px-2 py-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">
                                            {review.rating}/5
                                        </span>
                                    </div>
                                </div>




                                {/* Review Text */}
                                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                                    {review.review}
                                </p>

                                {/* Winback Action */}
                                {review.rating < 3 && (
                                    <button
                                        className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                    >
                                        Customer Winback
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Scroller>
        </div>
    );
}