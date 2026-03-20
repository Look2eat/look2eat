"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Share2, Package, CreditCard, Truck } from "lucide-react";

import { cn } from "@/lib/utils";

interface StageItem {
    id: string;
    text: string;
    completed: boolean;
    icon: React.ReactNode;
}

interface ThemeColors {
    // Background gradients
    outerGradient?: {
        from: string;
        to: string;
    };
    darkGradient?: {
        from: string;
        to: string;
    };

    // Header colors
    headerBackground?: string;
    headerText?: string;
    percentageText?: string;

    // Card colors
    cardBackground?: string;
    dividerColor?: string;

    // Stage colors
    stageTitle?: string;
    completedBadge?: {
        background: string;
        text: string;
    };
    todoBadge?: {
        background: string;
        text: string;
    };

    // Item colors
    completedIcon?: {
        background: string;
        text: string;
    };
    completedText?: string;
    pendingIcon?: string;
    pendingText?: string;

    // Button colors
    button?: {
        background: string;
        hover: string;
        text: string;
    };
}
interface Reward {
    rewardId: string,
    rewardName: string,
    redeemedCount: number,
}
interface OnboardingStagesProps {
    className?: string;
    enableAnimations?: boolean;
    onButtonClick?: () => void;
    rewards: Reward[]
    // Customization props
    title?: string;
    percentage?: number;
    buttonText?: string;

    // Theme customization
    theme?: 'blue' | 'purple' | 'green' | 'orange' | 'custom';
    customColors?: ThemeColors;

    // Animation controls
    animationDuration?: number;
    staggerDelay?: number;

    // Layout props
    variant?: 'default' | 'compact' | 'expanded';
    showPercentage?: boolean;
    rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

// Predefined theme configurations
const themes: Record<string, ThemeColors> = {
    blue: {
        outerGradient: { from: "from-blue-100", to: "to-purple-100" },
        darkGradient: { from: "from-blue-400", to: "to-purple-400" },
        headerText: "text-blue-800",
        percentageText: "text-blue-800",
        cardBackground: "bg-white",
        dividerColor: "bg-gray-200",
        stageTitle: "text-gray-900",
        completedBadge: { background: "bg-green-100", text: "text-green-700" },
        todoBadge: { background: "bg-blue-100", text: "text-blue-700" },
        completedIcon: { background: "bg-green-500", text: "text-white" },
        completedText: "text-gray-700",
        pendingIcon: "text-gray-500",
        pendingText: "text-gray-500",
        button: { background: "bg-blue-600", hover: "hover:bg-blue-700", text: "text-white" },
    },
    purple: {
        outerGradient: { from: "from-purple-100", to: "to-pink-100" },
        headerText: "text-purple-800",
        percentageText: "text-purple-800",
        cardBackground: "bg-white",
        dividerColor: "bg-gray-200",
        stageTitle: "text-gray-900",
        completedBadge: { background: "bg-green-100", text: "text-green-700" },
        todoBadge: { background: "bg-purple-100", text: "text-purple-700" },
        completedIcon: { background: "bg-green-500", text: "text-white" },
        completedText: "text-gray-700",
        pendingIcon: "text-gray-500",
        pendingText: "text-gray-500",
        button: { background: "bg-purple-600", hover: "hover:bg-purple-700", text: "text-white" },
    },
    green: {
        outerGradient: { from: "from-green-100", to: "to-emerald-100" },
        headerText: "text-green-800",
        percentageText: "text-green-800",
        cardBackground: "bg-white",
        dividerColor: "bg-gray-200",
        stageTitle: "text-gray-900",
        completedBadge: { background: "bg-emerald-100", text: "text-emerald-700" },
        todoBadge: { background: "bg-green-100", text: "text-green-700" },
        completedIcon: { background: "bg-emerald-500", text: "text-white" },
        completedText: "text-gray-700",
        pendingIcon: "text-gray-500",
        pendingText: "text-gray-500",
        button: { background: "bg-green-600", hover: "hover:bg-green-700", text: "text-white" },
    },
    orange: {
        outerGradient: { from: "from-orange-100", to: "to-amber-100" },
        headerText: "text-orange-800",
        percentageText: "text-orange-800",
        cardBackground: "bg-white",
        dividerColor: "bg-gray-200",
        stageTitle: "text-gray-900",
        completedBadge: { background: "bg-green-100", text: "text-green-700" },
        todoBadge: { background: "bg-orange-100", text: "text-orange-700" },
        completedIcon: { background: "bg-green-500", text: "text-white" },
        completedText: "text-gray-700",
        pendingIcon: "text-gray-500",
        pendingText: "text-gray-500",
        button: { background: "bg-orange-600", hover: "hover:bg-orange-700", text: "text-white" },
    },
};

export function TopRewardsCard({
    className,
    enableAnimations = true,
    onButtonClick,
    title = "ONBOARDING",
    percentage = 40,
    buttonText = "Let's Go",
    theme = 'blue',
    customColors,
    animationDuration = 1500,
    staggerDelay = 0.12,
    variant = 'default',
    showPercentage = true,
    rounded = 'xl',
    rewards
}: OnboardingStagesProps) {
    const [displayPercentage, setDisplayPercentage] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    // Get theme colors
    const themeColors = customColors || themes[theme] || themes.blue;

    // Responsive padding based on variant
    const variantStyles = {
        compact: "p-0.5",
        default: "p-1",
        expanded: "p-2",
    };

    // Rounded styles
    const roundedStyles = {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
    };

    // Animate percentage counter on mount
    useEffect(() => {
        if (!enableAnimations || shouldReduceMotion) {
            setDisplayPercentage(percentage);
            return;
        }

        const startTime = Date.now();

        const animateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            // More sophisticated easing with overshoot
            const easeOut = 1 - Math.pow(1 - progress, 2.5);
            const currentValue = Math.round(easeOut * percentage);

            setDisplayPercentage(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            }
        };

        // Longer delay for more dramatic entrance
        const timeout = setTimeout(animateCounter, 800);
        return () => clearTimeout(timeout);
    }, [enableAnimations, shouldReduceMotion, percentage, animationDuration]);

    const stage1Items: StageItem[] = [
        {
            id: "mission",
            text: "Define your brand mission",
            completed: true,
            icon: <Check className="w-4 h-4" />,
        },
        {
            id: "logo",
            text: "Upload your brand logo",
            completed: true,
            icon: <Check className="w-4 h-4" />,
        },
        {
            id: "colors",
            text: "Select your brand colors",
            completed: true,
            icon: <Check className="w-4 h-4" />,
        },
    ];



    const shouldAnimate = enableAnimations && !shouldReduceMotion;

    // Enhanced animation variants with more sophisticated timing
    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.92,
            rotateX: 10, // Subtle 3D entrance effect
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 280,
                damping: 32,
                mass: 0.9,
                staggerChildren: staggerDelay,
                delayChildren: 0.15,
            },
        },
    };

    const headerVariants: Variants = {
        hidden: { opacity: 0, x: -30, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 350,
                damping: 28,
                mass: 0.7,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            x: -25,
            scale: 0.95,
            filter: "blur(4px)",
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 28,
                mass: 0.6,
            },
        },
    };

    const stageContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay * 0.8,
                delayChildren: 0.1,
            },
        },
    };

    const iconVariants: Variants = {
        hidden: { scale: 0, rotate: -180, opacity: 0 },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 22,
                mass: 0.5,
            },
        },
    };

    const buttonVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 25,
            scale: 0.95,
            rotateX: 5,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
                delay: 1.2, // Much longer delay for dramatic entrance
            },
        },
    };

    const percentageVariants: Variants = {
        hidden: { scale: 0, opacity: 0, rotate: -10 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.6,
                delay: 1.5, // Animated after counter finishes
            },
        },
    };

    return (
        <motion.div
            className={cn("relative", className)}
            initial={shouldAnimate ? "hidden" : "visible"}
            animate="visible"
            variants={shouldAnimate ? containerVariants : undefined}
        >
            {/* Outer card with customizable gradient */}
            <div className={cn(variantStyles[variant], " bg-gradient-to-tr  from-amber-600 to-amber-100 dark:from-[#312110] dark:to-[#432e16]", roundedStyles[rounded], "shadow-lg")}
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between px-4 py-2"
                    variants={shouldAnimate ? headerVariants : undefined}
                >
                    <h1 className={cn(
                        "text-md font-semibold tracking-wide text-gray-700 text-lg dark:text-white",

                    )}>
                        {title}
                    </h1>
                    {showPercentage && (
                        <motion.div
                            className={cn("text-md font-bold", themeColors.percentageText)}
                            variants={shouldAnimate ? percentageVariants : undefined}
                        >
                            {displayPercentage}%
                        </motion.div>
                    )}
                </motion.div>

                {/* Inner card */}
                <motion.div
                    className={cn(
                        "min-h-114.5 bg-background dark:bg-neutral-900",
                        variant === 'compact' ? 'rounded-lg' : 'rounded-2xl',
                        "overflow-hidden"
                    )}
                    variants={shouldAnimate ? itemVariants : undefined}
                >
                    <div className={cn(
                        variant === 'compact' ? 'p-4 pt-3' : variant === 'expanded' ? 'p-6 pt-8 pb-0' : 'p-8 pt-6'
                    )}>

                        {/* Stage 1 */}
                        <motion.div
                            className="mb-8"
                            variants={shouldAnimate ? stageContainerVariants : undefined}
                        >


                            <motion.div
                                className="space-y-4"
                                variants={shouldAnimate ? stageContainerVariants : undefined}
                            >
                                {rewards.map((reward, index) => (
                                    <motion.div
                                        key={reward.rewardId}
                                        className="flex items-center space-x-3 border border-border/70 rounded-lg p-3"
                                        variants={shouldAnimate ? itemVariants : undefined}
                                        custom={index}
                                    >
                                        {/* add */}
                                        {/* Rank Icon (reusing same circle UI) */}
                                        <motion.div
                                            className={cn(
                                                "flex items-center justify-center w-6 h-6 rounded-full text-lg text-muted-foreground font-bold ",


                                            )}
                                            variants={shouldAnimate ? iconVariants : undefined}
                                            whileHover={
                                                shouldAnimate
                                                    ? {
                                                        scale: 1.15,
                                                        rotate: 10,
                                                        transition: {
                                                            type: "spring",
                                                            stiffness: 500,
                                                            damping: 20,
                                                        },
                                                    }
                                                    : {}
                                            }
                                        >
                                            {index + 1}
                                        </motion.div>

                                        {/* reward Info */}
                                        <div className="flex justify-between w-full items-center">

                                            <div>
                                                <span className={cn("font-medium text-gray-700 dark:text-gray-200")}>
                                                    {reward.rewardName}
                                                </span>

                                            </div>

                                            {/* Right side */}
                                            <div className="text-right">
                                                <p className="text-sm font-semibold">
                                                    {reward.redeemedCount}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Redeemed
                                                </p>
                                            </div>

                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Divider */}
                        {/* <motion.div
              className={cn("h-px mb-8", themeColors.dividerColor)}
              variants={shouldAnimate ? itemVariants : undefined}
            /> */}



                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
