import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

function MarketingCard() {
    const { resolvedTheme } = useTheme()

    const isDark = resolvedTheme === 'dark'
    return (
        <div className="w-full overflow-hidden relative rounded-2xl  text-xl md:text-4xl font-bold text-foreground bg-white dark:bg-[#121214] h-60 font-poppins flex justify-center items-center ">
            <div className="w-full  rounded-4xl">
                <Image
                    src={isDark ? '/Marketing_coming_soon/CSF_big_dark.svg' : '/Marketing_coming_soon/CSF_big_light.svg'}
                    alt="Banner"
                    fill
                    className="hidden lg:block object-contain"
                />
                <Image
                    src={isDark ? '/Marketing_coming_soon/CSF_dark.svg' : '/Marketing_coming_soon/CSF_light.svg'}
                    alt="Banner"
                    fill
                    className="block lg:hidden object-contain "
                />
            </div>
        </div>
    )
}

export default MarketingCard