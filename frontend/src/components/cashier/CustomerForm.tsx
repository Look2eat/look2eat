'use-client'

import { Customer } from "@/types/customer";
import { useState } from "react";
import RedeemConfirmationModal from "./Confiramtion";


interface Props {
  customer: Customer;
  onSuccess: () => void;
}

export default function CustomerForm({ customer, onSuccess }: Props) {
  const [isChecked, setIsChecked] = useState(true);
  const [name, setName] = useState(customer.name);
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    onSuccess();
  };



  const isAmountValid = amount && Number(amount) > 0;
  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.10)]">
      <label className="block mb-2 font-medium dark:text-black">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        // 🔥 key change
        className={`w-full rounded-xl px-4 py-3 mb-4 bg-gray-100 dark:text-black outline-0
        }`}
        placeholder="Enter Customer Name"
      />

      <label className="block mb-2 font-medium dark:text-black">
        Bill Amount
      </label>

      <div className="relative mb-4">
        {/* Fixed ₹ symbol */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
          ₹
        </span>

        <input
          value={amount}
          inputMode="numeric"
          type="number"
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



      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={isChecked} className="bg-white border-gray-300 accent-blue-600"
          onChange={(e) => setIsChecked(e.target.checked)} />
        <p className="text-sm text-gray-600">
          Customer agrees to receive WhatsApp updates
        </p>
      </div>

      <button
        disabled={!isAmountValid}
        onClick={() => setIsModalOpen(true)}
        className={`w-full py-3 rounded-xl text-white transition-all duration-200
    ${isAmountValid
            ? "bg-[#3b2a26] hover:opacity-90"
            : "bg-[#3b2a26] opacity-90 cursor-not-allowed"
          }`}
      >
        Submit
      </button>
      <RedeemConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        purchaseAmount={amount}
        customerName={name}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
