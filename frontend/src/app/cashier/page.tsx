"use client";

import { useEffect, useState } from "react";
import CashierLayout from "@/components/cashier/CashierLayout";
import CashierLoyaltyPreview from "@/components/cashier/CashierLoyaltyPreview";
import CustomerPanel from "@/components/cashier/CustomerPanel";
import { Customer } from "@/types/customer";


export default function CashierPage() {
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

    useEffect(() => {
      console.log("Selected customer:", selectedCustomer);
    }, [selectedCustomer]);
  

  const mockRewards = [
    { id: "1", pointsRequired: 200, description: "Get ₹50 off" },
    { id: "2", pointsRequired: 500, description: "Free Cappuccino" },
    { id: "3", pointsRequired: 1000, description: "Get ₹500 off" },
    { id: "4", pointsRequired: 2000, description: "Get ₹1000 off" },
  ];
  const [lookupResetKey, setLookupResetKey] = useState(0);
function handleOtpSuccess() {
  setSelectedCustomer(null);              // 🔥 remove customer
  setLookupResetKey((prev) => prev + 1);  // 🔥 reset lookup input
}
  return (
    <CashierLayout
      left={
        <CustomerPanel
  onCustomerChange={setSelectedCustomer}
  resetKey={lookupResetKey}
  onOtpSuccess={handleOtpSuccess}   // 👈 ADD THIS
/>
      }
      right={
        <CashierLoyaltyPreview
          name={selectedCustomer?.name ?? ""}
          points={selectedCustomer?.points ?? 0}
          rewards={mockRewards}
          expiryDate="3 Aug, 2026"
          phone={selectedCustomer?.phone ?? ""}
          negativeReview={selectedCustomer?.negativeReview ?? false}
          lastVisit={selectedCustomer?.lastVisit ?? ""}
          onOtpSuccess={handleOtpSuccess}
        />
      }
    />
  );
}
