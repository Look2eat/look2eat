"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";

function ClientFeedback() {
    const testimonialRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.4,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    return (
        <main className="w-full bg-white">
            <section className="relative  h-full container text-black mx-auto  rounded-lg  py-14 bg-white" ref={testimonialRef}>
                <article className={"max-w-screen-md mx-auto text-center space-y-2 "} >
                    <TimelineContent as="h1" className={"xl:text-4xl text-3xl  font-semibold"} animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
                        Trusted by Startups and the worlds&apos;s largest companies
                    </TimelineContent>
                    <TimelineContent as="p" className={"mx-auto text-gray-500"} animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef}>
                        Let&apos;s hear how Zuplin client&apos;s feels about our service
                    </TimelineContent>
                </article>
                <div className="lg:grid lg:grid-cols-3  gap-2 flex flex-col w-full lg:py-10 pt-10 pb-4 lg:px-10 px-4">
                    <div className="md:flex lg:flex-col lg:space-y-2 h-full lg:gap-0 gap-2 ">
                        <TimelineContent animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef} className=" lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-primaryColor overflow-hidden rounded-lg border border-gray-200 p-5">
                            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                            <article className="mt-auto">
                                <p>
                                    Zuplin has completely transformed how we engage with our customers. From real-time feedback to automated loyalty rewards, we&apos;ve seen a noticeable increase in repeat visits.
                                </p>
                                <div className="flex justify-between pt-5">
                                    <div>
                                        <h2 className=" font-semibold lg:text-xl text-sm">
                                            Arjun Mehta
                                        </h2>
                                        <p className="">Owner, Urban Bites</p>
                                    </div>
                                    <Image
                                        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=2706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] lg:h-fit  lg:shrink-0 flex flex-col justify-between relative bg-blue-600 text-white overflow-hidden rounded-lg border border-gray-200 p-5">
                            <article className="mt-auto">
                                <p>
                                    The WhatsApp marketing feature alone is a game-changer. We can now reach our customers instantly with offers.
                                </p>
                                <div className="flex justify-between pt-5">
                                    <div>
                                        <h2 className=" font-semibold text-xl">Neha Kapoor</h2>
                                        <p className="">Founder, Spice Junction</p>
                                    </div>
                                    <Image
                                        src="https://images.unsplash.com/photo-1570945880236-10f34833a271?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                    </div>
                    <div className="lg:h-full  md:flex lg:flex-col h-fit lg:space-y-2 lg:gap-0 gap-2">
                        <TimelineContent animationNum={2} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-200 p-5">
                            <article className="mt-auto">
                                <p className="2xl:text-base text-sm">
                                    Zuplin helped us turn customer feedback into real growth. We improved our ratings and attracted more new diners within just a few months.
                                </p>
                                <div className="flex justify-between items-end pt-5">
                                    <div>
                                        <h2 className=" font-semibold lg:text-xl text-lg">
                                            Rahul Verma{" "}
                                        </h2>
                                        <p className="lg:text-base text-sm">Manager, Taste Haven</p>
                                    </div>
                                    <Image
                                        src="https://plus.unsplash.com/premium_photo-1691030254390-aa56b22e6a45?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="lg:w-16 lg:h-16 w-12 h-12 rounded-xl object-cover"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={3} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-200 p-5">
                            <article className="mt-auto">
                                <p className="2xl:text-base text-sm">
                                    Their loyalty system keeps our customers coming back. It’s simple, effective, and has boosted our retention like never before.
                                </p>
                                <div className="flex justify-between items-end pt-5">
                                    <div>
                                        <h2 className=" font-semibold lg:text-xl text-lg">Priya Sharma </h2>
                                        <p className="lg:text-base text-sm">Owner, Café Bliss</p>
                                    </div>
                                    <Image
                                        src="https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="lg:w-16 lg:h-16 w-12 h-12 rounded-xl object-cover object-top"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={4} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-200 p-5">
                            <article className="mt-auto">
                                <p className="2xl:text-base text-sm">
                                    What we love most is how everything is automated — feedback collection, marketing, and rewards. It saves us time and drives real results.

                                </p>
                                <div className="flex justify-between items-end pt-5">
                                    <div>
                                        <h2 className=" font-semibold lg:text-xl text-lg">
                                            Karan Malhotra
                                        </h2>
                                        <p className="lg:text-base text-sm"> Director, Food Factory</p>
                                    </div>
                                    <Image
                                        src="https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="lg:w-16 lg:h-16 w-12 h-12 rounded-xl object-cover"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                    </div>
                    <div className="h-full md:flex lg:flex-col lg:space-y-2 lg:gap-0 gap-2">
                        <TimelineContent animationNum={5} customVariants={revealVariants} timelineRef={testimonialRef} className=" lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-blue-600 text-white overflow-hidden rounded-lg border border-gray-200 p-5">
                            <article className="mt-auto">
                                <p>
                                    Zuplin has become an essential part of our growth strategy. We&apos;ve built stronger relationships with customers
                                </p>
                                <div className="flex justify-between pt-5">
                                    <div>
                                        <h2 className=" font-semibold text-xl">Simran Gill</h2>
                                        <p className="">Co-founder, The Hungry Hub</p>
                                    </div>
                                    <Image
                                        src="https://images.unsplash.com/photo-1624610262594-ceda28f6976e?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="w-16 h-16 rounded-xl object-cover object-top"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                        <TimelineContent animationNum={6} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-primaryColor overflow-hidden rounded-lg border border-gray-200 p-5">
                            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                            <article className="mt-auto">
                                <p>
                                    Zuplin has been a true growth partner for us. From collecting actionable customer feedback to driving repeat orders through loyalty and WhatsApp campaigns, the impact has been outstanding.
                                </p>
                                <div className="flex justify-between pt-5">
                                    <div>
                                        <h2 className=" font-semibold text-xl">Amit Khanna</h2>
                                        <p className="">Owner, Bistro Lane</p>
                                    </div>
                                    <Image
                                        src="https://images.unsplash.com/photo-1613462539650-e6f336d5994c?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                </div>
                            </article>
                        </TimelineContent>
                    </div>
                </div>

                <div className="absolute border-b-2 border-[#e6e6e6] bottom-4 h-16 z-[2] md:w-full w-[90%] md:left-0 left-[5%]">
                    <div className="container mx-auto w-full h-full relative before:absolute before:-left-2 before:-bottom-2 before:w-4 before:h-4 before:bg-white before:shadow-sm before:border border-gray-200 before:border-gray-300 after:absolute after:-right-2 after:-bottom-2 after:w-4 after:h-4 after:bg-white after:shadow-sm after:border after:border-gray-300 "></div>
                </div>
            </section>
        </main>
    );
}

export default ClientFeedback;
