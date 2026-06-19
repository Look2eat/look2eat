import LoyaltyStats from '@/components/dashboard/loyalty/LoyaltyStats'
import React from 'react'

function LoyaltyCard() {
    return (
        <div className="w-full overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl font-bold text-foreground bg-white dark:bg-[#121214] h-60  font-poppins">
            <LoyaltyStats classname='bg-background dark:bg-[#1E1F27]' />
        </div>
    )
}

export default LoyaltyCard