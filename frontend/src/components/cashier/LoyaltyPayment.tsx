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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleContinue() {
    if (!amount) return;
    onContinue(amount);
    setAmount("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[90vw]
    !max-w-none
    sm:!max-w-md
    rounded-2xl
    dark:bg-white
    dark:text-black
    fixed
    top-[10%] sm:top-1/2
    translate-y-0 sm:-translate-y-1/2
    max-h-[90vh]
    overflow-y-auto">
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
            {/* Fixed ₹ symbol */}
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
              placeholder="0.00 (Enter bill amount after discount)"
              className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-4 text-lg 
       focus:outline-none dark:text-black
       [appearance:textfield]
       [&::-webkit-outer-spin-button]:appearance-none
       [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>


          <Button
            className={cn(color, "w-full hover:bg-[#3b2a26] border-0")}
            onClick={handleContinue}
            disabled={!amount}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}