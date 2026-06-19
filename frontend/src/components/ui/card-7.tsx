'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TravelRouteCardProps {
  titleRating: string;
  titleReviewPushed: string;
  rating: string;
  numberOfReviews: string;
  imageUrl: string;
  className?: string;
}

export const TravelRouteCard: React.FC<TravelRouteCardProps> = ({
  titleRating,
  titleReviewPushed,
  rating,
  numberOfReviews,
  imageUrl,
  className,
}) => {
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'relative w-xl h-56 rounded-2xl overflow-hidden p-6 text-white shadow-lg isolate',
        className
      )}
    >
      {/* Background */}
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src={imageUrl}
          alt="Route map"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 dark:bg-neutral-950/70  bg-neutral-700/50" />
      </div>

      {/* Content */}
      <div className="flex h-full items-start">
        {/* Left Section */}
        <div className="flex flex-1 flex-col justify-start gap-10 ">
          <motion.div variants={itemVariants}>
            <h2 className="max-w-30 text-lg font-semibold leading-tight md:text-2xl">
              {titleRating}
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-5">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              {rating}
            </h1>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="mx-8 h-full w-px shrink-0 bg-white/30"
        />

        {/* Right Section */}
        <div className="flex flex-1 flex-col justify-center gap-10">
          <motion.div variants={itemVariants}>
            <h2 className="max-w-55 text-lg font-semibold leading-tight md:text-2xl">
              {titleReviewPushed}
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-5 flex items-end gap-3"
          >
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              {numberOfReviews}
            </h1>

            <span className="mb-2 text-sm uppercase tracking-wider text-white/80">
              Reviews
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};