'use-client'

import { Customer } from "@/types/customer";
import { useState } from "react";
import RedeemConfirmationModal from "./Confiramtion";


interface Props {
  customer: Customer;
onSuccess: () => void; 
  }
  
  export default function CustomerForm({ customer,onSuccess }: Props) {
    const [isChecked, setIsChecked] = useState(true);
    const [name, setName] = useState(customer.name);
    const [amount, setAmount] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = () => {
    console.log("Next customer...");
    // reset form / clear state here if needed
    onSuccess();
  };


  const isNew = customer.isNew;
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
  
        <label className="block mb-2 font-medium dark:text-black">Bill Amount</label>
        <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
          placeholder="₹0.00 (Enter bill amount after discount)"
          className="w-full bg-gray-100 rounded-xl px-4 py-3 mb-4 dark:text-black outline-0"
        />
  
    
  
        <div className="flex items-center gap-2 mb-4"> 
          <input type="checkbox" checked={isChecked} className="bg-white border-gray-300 accent-blue-600"
  onChange={(e) => setIsChecked(e.target.checked)} />
          <p className="text-sm text-gray-600">
            Customer agrees to receive WhatsApp updates
          </p>
        </div>
  
        <button className="w-full bg-[#3b2a26] text-white py-3 rounded-xl"
         onClick={() => setIsModalOpen(true)}>
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
  