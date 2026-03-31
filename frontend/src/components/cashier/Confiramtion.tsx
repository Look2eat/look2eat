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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseAmount: string;
  customerName: string;
  onConfirm: () => void;
  color?: string;
}

export default function RedeemConfirmationModal({
  open,
  onOpenChange,
  purchaseAmount,
  customerName,
  onConfirm,
  color = "bg-[#322424]",
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onConfirm(); // move to next customer
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
            <DialogTitle className="text-2xl font-bold text-center dark:text-black">
              Congratulations 🎉
            </DialogTitle>

            <DialogDescription className="text-neutral-700 text-lg mt-2">
              <strong>{customerName}</strong> has successfully earned{" "}
              <strong>{Math.floor(parseInt(purchaseAmount) / 10)} PTS!</strong>
            </DialogDescription>
          </DialogHeader>

          {/* Reward Summary Box */}
          {/* <div
            className={cn(
              "p-4 rounded-xl text-white w-full text-center",
              color
            )}
          >
            <p className="font-bold text-md">{rewardPoints} PTS</p>
            <p className="text-sm">{rewardName}</p>
          </div> */}

          <DialogClose>
            <Button
              className={cn(color, "hover:bg-[#3b2a26] border-0 w-full")}
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