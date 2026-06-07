import AvgRating from '@/components/dashboard/feedback/AvgRating'
import { FeedbackCampaign } from '@/components/dashboard/feedback/FeedbackCampaign'
import ReviewsScroller from '@/components/dashboard/feedback/ReviewScroll'
import FeedbackStats from '@/components/shadcn-space/blocks/statistics-02/FeedbackStats'
import React from 'react'

function page() {
    return (
        <div className=" px-6 py-6 font-poppins gap-6 flex flex-col">
            <div>
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#1D2033] dark:text-[#FDFEFF]">Feedback</h1>
                <FeedbackStats />
            </div>
            <div className='flex gap-6'>
                <AvgRating />
                <FeedbackCampaign />
            </div>
            <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
                <ReviewsScroller />
            </div>
        </div>
    )
}

export default page