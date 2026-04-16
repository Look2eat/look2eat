
"use client";

import { useEffect, useState } from "react";
import CustomerLookup from "./CustomerLookup";
import CustomerForm from "./CustomerForm";
import { Customer } from "@/types/customer";

interface Props {
  onCustomerChange: (customer: Customer | null) => void;
  resetKey?: number;
  onOtpSuccess?: () => void;
  brandId: string;
}

export default function CustomerPanel({ onCustomerChange, resetKey,
  onOtpSuccess, brandId }: Props) {

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  useEffect(() => {
    setSelectedCustomer(null);
  }, [resetKey]);

  const handleSelect = (customer: Customer | null) => {
    console.log("CustomerPanel got:", customer); // 👈 add this
    setSelectedCustomer(customer);
    onCustomerChange(customer);
  };
  useEffect(() => console.log("Changed"), [selectedCustomer])

  return (
    <div>
      <CustomerLookup onCustomerSelect={handleSelect} resetKey={resetKey} brandId={brandId} />

      {selectedCustomer && (
        <CustomerForm customer={selectedCustomer} onSuccess={onOtpSuccess!} brandId={brandId} />
      )}
    </div>
  );
}
