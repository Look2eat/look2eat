"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  onContinue: (amount: string) => void;
  color?: string;
}

export default function BillAmountModal({
  open,
  onOpenChange,
  customerName,
  onContinue,
  color = "bg-[#322424]",
}: Props) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Reset loading when modal reopens
      setIsLoading(false);
      setAmount("");
    }
  }, [open]);

  async function handleContinue() {
    if (!amount || isLoading) return;
    setIsLoading(true);
    await onContinue(amount);
    // Don't reset isLoading here — parent closes this modal,
    // the useEffect above resets it on next open
  }

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) setIsLoading(false);
      onOpenChange(next);
    }}>
      <DialogContent className={cn(
        "!w-[90vw] !max-w-none sm:!max-w-md",
        "!rounded-2xl",
        "p-6",
        "dark:bg-white dark:text-black",
        "max-h-[90vh] overflow-y-auto",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      )}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold dark:bg-white dark:text-black">
            Enter Bill Amount
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-700 text-lg mt-2">
            Enter purchase amount for <strong>{customerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
              ₹
            </span>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              placeholder="0.00 (Enter bill amount after discount)"
              disabled={isLoading}
              className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-4 text-lg 
                focus:outline-none dark:text-black
                disabled:opacity-50 disabled:cursor-not-allowed
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <Button
            className={cn(color, "w-full hover:bg-[#3b2a26] border-0 p-4 py-6 font-semibold")}
            onClick={handleContinue}
            disabled={!amount || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Processing...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}