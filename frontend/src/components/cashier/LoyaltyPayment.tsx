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
      <DialogContent className="sm:max-w-md dark:bg-white dark:text-black">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold dark:bg-white dark:text-black">
            Enter Bill Amount
          </DialogTitle>

          <DialogDescription className="text-center text-neutral-700 text-lg mt-2">
            Enter purchase amount for <strong>{customerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <input
            ref={inputRef}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₹0.00 (Enter bill amount after discount)"
            className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg 
             focus:outline-none dark:text-black
             [appearance:textfield]
             [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:appearance-none"
          />

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