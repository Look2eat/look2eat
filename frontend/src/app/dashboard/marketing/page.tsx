import Image from "next/image";
import React from "react";
import { Pill, PillIndicator } from "@/components/kibo-ui/pill";

function Page() {
    return (
        <section className="min-h-full bg-background  text-[#20212F] flex items-center justify-center rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 ">
            <div className="w-full max-w-7xl rounded-[32px]  bg-white dark:bg-[#27272A] p-6 sm:p-8 md:p-10 lg:p-12 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center py-5">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="font-bold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl  text-[#20212F] dark:text-white">
                            Focus on Serving Your Customers.
                            <br />
                            <span className="text-green-600">
                                We&apos;ll Handle Your Marketing...
                            </span>
                        </h1>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col items-center lg:items-end gap-8 lg:gap-26 lg:h-full">
                        <Pill className="font-semibold text-sm dark:bg-[#040317]">
                            <PillIndicator pulse variant="success" />
                            Whatsapp Marketing Launching Soon
                        </Pill>

                        <Image
                            src="/marketing.svg"
                            alt="Marketing Illustration"
                            width={1000}
                            height={800}
                            priority
                            className="w-full max-w-138 h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Page;