/* eslint-disable react/jsx-key */
'use client';

import React from 'react';
import { SunIcon } from 'lucide-react';
import { IoMoonOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const THEME_OPTIONS = [
	{
		icon: SunIcon,
		value: 'light',
	},
	{
		icon: IoMoonOutline,
		value: 'dark',
	},
];

export function ToggleTheme() {
	const { theme, setTheme } = useTheme();

	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <div className="flex h-8 w-24" />;
	}

	return (
		<motion.div
			key={String(isMounted)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="bg-white dark:bg-muted/80 inline-flex items-center overflow-hidden rounded-full h-10 w-20"
			role="radiogroup"
		>
			{THEME_OPTIONS.map((option) => (
				<button
					className={cn(
						'relative flex size-10 cursor-pointer items-center justify-center rounded-full transition-all p-1',
						theme === option.value
							? 'dark:text-foreground text-[#747474]'
							: 'text-muted-foreground hover:text-foreground',
					)}
					role="radio"
					aria-checked={theme === option.value}
					aria-label={`Switch to ${option.value} theme`}
					onClick={() => setTheme(option.value)}
				>
					{theme === option.value && (
						<motion.div
							layoutId="theme-option"
							transition={{ type: 'spring', bounce: 0.1, duration: 0.75 }}
							className=" absolute inset-1 rounded-full bg-background"
						/>
					)}
					<option.icon className="size-5 relative z-10" />
				</button>
			))}
		</motion.div>
	);
}
