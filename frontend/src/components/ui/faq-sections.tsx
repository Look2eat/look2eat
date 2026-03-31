import { cn } from "@/lib/utils";
import { useState } from "react";
import React from "react";

const FaqSection = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqs = [
        {
            question: "What is Zuplin and how does it help my restaurant?",
            answer: "Zuplin is a digital loyalty and customer engagement platform designed for restaurants. It helps you collect real-time customer feedback, run targeted WhatsApp marketing campaigns, and build loyalty programs that increase repeat visits and attract new customers."
        },

        {
            question: "How does WhatsApp marketing work with Zuplin?",
            answer: "Zuplin allows you to send personalized offers, updates, and promotions directly to your customers via WhatsApp. This ensures higher open rates and better engagement compared to traditional marketing channels."
        },

        {
            question: "Is Zuplin suitable for all types of restaurants?",
            answer: "Yes, Zuplin works for all types of restaurants including cafes, QSRs, fine dining, and cloud kitchens. It is flexible and can be tailored to your business needs."
        },

        {
            question: "Can I track the performance of my campaigns?",
            answer: "Yes, Zuplin provides insights and analytics that help you track customer engagement, campaign performance, and overall business growth."
        },

    ];
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-0 p-8">
                <img
                    className="max-w-sm w-full rounded-xl h-90"
                    src="https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />
                <div>
                    <p className="text-indigo-600 text-lg font-semibold">FAQ&apos;s</p>
                    <h1 className="text-3xl font-semibold">Looking for answer?</h1>
                    <p className="text-sm text-slate-500 mt-2 pb-4">
                        We help ypu grow your restaurant business.
                    </p>
                    {faqs.map((faq, index) => (
                        <div className="border-b border-slate-200 py-4 cursor-pointer" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium">
                                    {faq.question}
                                </h3>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}>
                                    <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FaqSection;