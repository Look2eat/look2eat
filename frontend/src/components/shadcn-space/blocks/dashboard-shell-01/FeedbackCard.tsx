import React from 'react'
import FeedbackStats from '../statistics-02/FeedbackStats'
import { FeedbackProvider } from '../../../../lib/auth/FeedbackContext'

function FeedbackCard() {
    return (
        <FeedbackProvider>
            <div className="w-full overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-white dark:bg-[#121214] font-poppins">
                <FeedbackStats classname='bg-background dark:bg-[#1E1F27] h-39' />
            </div>
        </FeedbackProvider>
    )
}

export default FeedbackCard