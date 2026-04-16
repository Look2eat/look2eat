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
import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coinsEarned: number;        // ← replaced purchaseAmount
  customerName: string;
  onConfirm: () => void;
  color?: string;
}

export default function RedeemConfirmationModal({
  open,
  onOpenChange,
  coinsEarned,                // ← replaced purchaseAmount
  customerName,
  onConfirm,
  color = "bg-[#322424]",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { });
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onConfirm();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="!w-[90vw]
    !max-w-none
    sm:!max-w-md
    rounded-2xl
    p-6
    dark:bg-white dark:text-black
    max-h-[90vh]
    overflow-y-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <DialogHeader>
            <div className="flex flex-col items-center">
              <video
                key={open ? "open" : "closed"}
                ref={videoRef}
                muted
                playsInline
                autoPlay
                className="w-40 h-40"
              >
                <source src="/success.webm" type="video/webm" />
                <source src="/success.mp4" type="video/mp4" />
              </video>
            </div>
            <DialogTitle className="text-2xl font-bold text-center dark:text-black">
              Congratulations 🎉
            </DialogTitle>

            <DialogDescription className="text-neutral-700 text-lg mt-2">
              <strong>{customerName}</strong> has successfully earned{" "}
              <strong>{coinsEarned} PTS!</strong>   {/* ← direct from API */}
            </DialogDescription>
          </DialogHeader>

          <DialogClose>
            <Button
              className={cn(color, "hover:bg-[#3b2a26] border-0 w-full p-4 py-6 font-semibold")}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Next Customer
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}