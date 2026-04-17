"use client";

import { useEffect, useState } from "react";
import CashierLayout from "@/components/cashier/CashierLayout";
import CashierLoyaltyPreview from "@/components/cashier/CashierLoyaltyPreview";
import CustomerPanel from "@/components/cashier/CustomerPanel";
import { Customer } from "@/types/customer";
import { getBrandIdFromToken } from "@/lib/auth";

export default function CashierPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lookupResetKey, setLookupResetKey] = useState(0);

  function handleOtpSuccess() {
    setSelectedCustomer(null);
    setLookupResetKey((prev) => prev + 1);
  }
  const brandId = getBrandIdFromToken();

  return (
    <CashierLayout
      left={
        <CustomerPanel
          onCustomerChange={setSelectedCustomer}
          resetKey={lookupResetKey}
          onOtpSuccess={handleOtpSuccess}
          brandId={brandId}
        />
      }
      right={
        <CashierLoyaltyPreview
          name={selectedCustomer?.name ?? ""}
          points={selectedCustomer?.points ?? 0}
          rewards={selectedCustomer?.rewards ?? []}                      // ← from API
          promotionalrewards={selectedCustomer?.promotionalrewards ?? []} // ← from API
          expiryDate={selectedCustomer?.expiryDate ?? ""}                // ← from API
          phone={selectedCustomer?.phone ?? ""}
          negativeReview={selectedCustomer?.negativeReview ?? false}
          lastVisit={selectedCustomer?.lastVisit ?? ""}
          onOtpSuccess={handleOtpSuccess}
          brandId={brandId}
        />
      }
    />
  );
}