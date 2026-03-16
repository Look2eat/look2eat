"use client"

import { Smile } from "lucide-react"

interface Props {
    totalFeedbacks: number
    averageRating: number
    positiveFeedback: number
    negativeFeedback: number
}

export default function FeedbackCard({
    totalFeedbacks,
    averageRating,
    positiveFeedback,
    negativeFeedback
}: Props) {
    return (
        <div className="p-8 rounded-2xl bg-[#e5fcf1]  dark:bg-[#0b1b13] flex flex-col gap-10 dark:hover:bg-[#0b1b13]/90 hover:bg-[#ddffef]">

            {/* Header */}
            <div className="flex items-center gap-3 text-2xl font-semibold">
                <Smile size={28} />
                Feedback
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-10">

                <div>
                    <p className="text-4xl font-bold">{totalFeedbacks}</p>
                    <p className=" mt-2 opacity-80">Total Feedbacks</p>
                </div>

                <div>
                    <p className="text-4xl font-bold">{averageRating}</p>
                    <p className=" mt-2 opacity-80">Average Rating</p>
                </div>

                <div>
                    <p className="text-4xl font-bold">{positiveFeedback}%</p>
                    <p className=" mt-2 opacity-80">Positive Feedback</p>
                </div>

                <div>
                    <p className="text-4xl font-bold">{negativeFeedback}%</p>
                    <p className=" mt-2 opacity-80">Negative Feedback</p>
                </div>

            </div>

            {/* Footer */}
            <button className="underline text-lg font-medium w-fit hover:opacity-70">
                View More
            </button>

        </div>
    )
}