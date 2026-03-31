"use client";

import React from "react";
import { Footer } from "@/components/blocks/footer-section";
import ClientFeedback from "@/components/blocks/testimonial";
import FaqSection from "@/components/ui/faq-sections";
import Features from "@/components/ui/feature-sections";


import HeroSection from "@/components/ui/hero-section";
import LiquidLoading from "@/components/ui/liquid-loader";



// export default function Home() {
//   return (
//     <div className="">

//       <div className=" bg-black flex flex-col min-h-screen w-full items-center justify-center rounded-lg border  p-4">

//       <LiquidLoading />
//     </div>
//       </div>
//   );
// }
export default function Home() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <section id="hero" className="h-screen snap-start"><HeroSection /></section>
      <section id="features" className="h-screen snap-start flex items-center justify-center">
        <Features />
      </section>
      <section id="testimonials" className="h-screen snap-start"><ClientFeedback /></section>
      <section id="faq" className="h-screen snap-start flex items-center justify-center">
        <FaqSection />
      </section>
      <section className="snap-start"><Footer /></section>
    </div>
  );
}