"use client"

import Image from "next/image"

interface Props {
    title: string
    subtitle?: string
    description?: string

    primaryButtonText?: string
    secondaryButtonText?: string
    onPrimaryClick?: () => void
    onSecondaryClick?: () => void

    imageUrl: string
}

export default function LoyaltyEditCard({
    title,
    subtitle,
    description,
    primaryButtonText = "View",
    secondaryButtonText = "Edit",
    onPrimaryClick,
    onSecondaryClick,
    imageUrl,
}: Props) {
    return (
        <div>

            {/* LEFT CONTENT */}
            <div className="flex flex-col gap-6 max-w-xl z-10">

                <h1 className="text-5xl font-bold tracking-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-2xl font-semibold text-white/80">
                        {subtitle}
                    </p>
                )}

                {description && (
                    <p className="text-xl text-white/70">
                        {description}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex gap-6 mt-4">
                    <button
                        onClick={onPrimaryClick}
                        className="px-8 py-3 rounded-2xl bg-white text-black font-semibold text-lg hover:opacity-90 transition"
                    >
                        {primaryButtonText}
                    </button>

                    <button
                        onClick={onSecondaryClick}
                        className="px-8 py-3 rounded-2xl bg-[#f2d39b] text-black font-semibold text-lg hover:opacity-90 transition"
                    >
                        {secondaryButtonText}
                    </button>
                </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="absolute right-0 -bottom-50 top-0 flex items-center pr-6">

                <div className="relative w-55 h-[460px] -rotate-18 rounded-[40px] overflow-hidden bg-muted/50">
                    <Image
                        src={imageUrl}
                        alt="Loyalty Preview"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>



        </div>
    )
}