"use client";

import { useState } from "react";
import CashierLayout from "@/components/cashier/CashierLayout";
import CashierLoyaltyPreview from "@/components/cashier/CashierLoyaltyPreview";
import CustomerPanel from "@/components/cashier/CustomerPanel";
import { Customer } from "@/types/customer";
import { useCashierAuth } from "@/lib/cashier/CashierAuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function CashierPage() {
  const { cashier, isLoading } = useCashierAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lookupResetKey, setLookupResetKey] = useState(0);

  function handleOtpSuccess() {
    setSelectedCustomer(null);
    setLookupResetKey((prev) => prev + 1);
  }

  // Show spinner while cashier session is loading — same pattern as
  // DashboardLoader for admin. CashierAuthContext fetches /api/cashier/me
  // on mount; if cookie is missing middleware would have already redirected
  // to login before this component renders, but guard anyway.
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!cashier) return null;

  // brandId comes from the cashier JWT claims — no more hardcoded "12345".
  // outletId is also available here (cashier.outletId) if any component
  // needs it directly in the future.
  const { brandId } = cashier;

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
          rewards={selectedCustomer?.rewards ?? []}
          promotionalrewards={selectedCustomer?.promotionalrewards ?? []}
          expiryDate={selectedCustomer?.expiryDate ?? ""}
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