"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { OTPInput, SlotProps } from "input-otp";
import { useEffect, useRef, useState } from "react";
import { hover } from "framer-motion";
import { processRedemption, verifyCustomerOtp } from "@/services/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rewardName: string;
    rewardPoints: number;
    name: string

    color?: string;
    billAmount: string;
    customerPhone: string;
    brandId: string;
    milestoneId: string;
    onConfirm: (coinsEarned: number) => void; // ← add coinsEarned

}



export default function RedeemOtpModal({
    open,
    onOpenChange,
    rewardName,
    rewardPoints,
    onConfirm,
    name,
    color = "bg-[#322424]",
    billAmount,
    customerPhone,
    brandId,
    milestoneId,
}: Props) {
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
    const [redirecting, setRedirecting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [coinsEarned, setCoinsEarned] = useState<number>(0);

    useEffect(() => {
        if (isValid && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [isValid]);

    useEffect(() => {
        if (isValid) {
            closeButtonRef.current?.focus();
        }
    }, [isValid]);
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);
    async function handleSubmit(code?: string) {
        const otp = code ?? value;
        setIsValid(undefined);

        try {
            await verifyCustomerOtp(customerPhone, brandId, otp);
            setIsValid(true);
            // immediately fire redemption
            const redemptionRes = await processRedemption(customerPhone, brandId, milestoneId, Number(billAmount));
            setCoinsEarned(redemptionRes.data.coinsEarned); // ← store it
        } catch {
            setIsValid(false);
        }
        setValue("");
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    if (isValid) {
                        onConfirm(coinsEarned); // ← call confirm with coins earned
                    }
                    setIsValid(undefined);
                    setValue("");
                }
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className={cn(
                "!w-[90vw] !max-w-none sm:!max-w-md",
                "!rounded-2xl",          // force override shadcn's default rounded
                "p-6",
                "dark:bg-white dark:text-black",
                "max-h-[90vh] overflow-y-auto",
                "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            )}>
                <div className="flex flex-col items-center gap-3">



                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold dark:text-black">
                            {isValid ? <div className="flex flex-col items-center gap-2 ">
                                <video
                                    ref={videoRef}
                                    muted
                                    playsInline
                                    className="w-40 h-40"
                                >
                                    <source src="/success.webm" type="video/webm" />
                                    <source src="/success.mp4" type="video/mp4" />
                                </video><p className="p-2 pb-4">Congratulations 🎉</p></div> : "Redeem Reward"}
                        </DialogTitle>

                        <DialogDescription className="text-center text-neutral-700 text-xl">
                            {isValid ? (
                                <p>
                                    <strong>{name}</strong> has successfully redeemed{" "}
                                    <strong>{rewardName}</strong>

                                    {rewardPoints !== 0 && (
                                        <>
                                            {" "}for <strong>{rewardPoints} PTS</strong>
                                        </>
                                    )}
                                    !
                                    <br className="p-1" />
                                    Points Earned{" "}
                                    <strong>
                                        {coinsEarned}
                                    </strong>
                                </p>
                            ) : (
                                "Enter OTP to redeem reward"
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Reward Info */}
                {!isValid && (
                    <div className={cn("p-4 rounded-xl text-center text-white mb-6", color)}>
                        {rewardPoints !== 0 && <p className="font-bold text-md">{rewardPoints} PTS</p>}
                        <p className="text-sm">{rewardName}</p>
                    </div>
                )}

                {isValid ? (
                    <div className="text-center">
                        <DialogClose >
                            <Button className={cn(color, "hover:bg-[#3b2a26] border-0 p-4 py-6 font-semibold ")}
                                ref={closeButtonRef}
                                onClick={() => {

                                    onConfirm(coinsEarned);
                                    setIsValid(undefined);
                                    onOpenChange(false);

                                }}
                            >
                                Next Customer
                            </Button>
                        </DialogClose>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center ">
                            <OTPInput
                                ref={inputRef}
                                value={value}
                                onChange={setValue}
                                maxLength={4}
                                inputMode="numeric"
                                type="number"
                                autoFocus
                                containerClassName="flex items-center gap-3 "
                                render={({ slots }) => (
                                    <div className="flex gap-2 ">
                                        {slots.map((slot, idx) => (
                                            <Slot key={idx} {...slot} />
                                        ))}
                                    </div>
                                )}
                                onComplete={(code) => handleSubmit(code)}
                            />
                        </div>

                        {isValid === false && (
                            <p className="text-center text-xs text-red-500">
                                Invalid OTP. Please try again.
                            </p>
                        )}

                        <p className="text-center text-sm">
                            <button className="underline hover:no-underline">
                                Resend OTP
                            </button>
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                "flex size-10 items-center justify-center rounded-lg border border-neutral-300 bg-background font-medium text-foreground shadow-[0_0_20px_rgba(0,0,0,0.10)] transition-shadow dark:bg-white dark:text-black",
                { "ring-2 ring-ring": props.isActive }
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
        </div>
    );
}