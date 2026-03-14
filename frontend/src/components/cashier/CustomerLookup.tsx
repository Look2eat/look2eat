"use client";

import { useEffect, useState, useRef } from "react";
import { Customer } from "@/types/customer";

interface Props {
  onCustomerSelect: (customer: Customer | null) => void;
  resetKey?: number;
}

export default function CustomerLookup({ onCustomerSelect, resetKey }: Props) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Customer | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setPhone("");
    setResult(null);
    setNotFound(false);
    setOpen(false);
    onCustomerSelect(null);
  }, [resetKey]);

  useEffect(() => {
    if (phone.length < 7) {
      setResult(null);
      setNotFound(false);
      return;
    }


    const timer = setTimeout(async () => {
      setLoading(true);

      // 🔥 Replace with real DB search
      const mockCustomer =
        phone.includes("9888032")
          ? { name: "Avneet Singh", phone: "+91 9888032525", points: 640, negativeReview: true, expiryDate: "3 Aug, 2026", rewards: [] }
          : null;

      if (mockCustomer) {
        setResult(mockCustomer);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
      setOpen(true)
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [phone]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-black">Customer Details</h2>

      {/* Input */}
      <div className="relative">
        <input
          type="tel"
          ref={inputRef}
          inputMode="numeric"
          placeholder="Enter Customer Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-[#efefef] focus:outline-none text-lg dark:text-black"
        />

        {phone && (
          <button
            onClick={() => {
              setPhone("");
              setResult(null);
              setOpen(false)
              setNotFound(false);
              onCustomerSelect(null); // 🔥 dismiss customer form
            }}
            className="absolute right-6 top-4 text-gray-500"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-sm text-gray-500">Searching...</p>
      )}

      {/* Found Customer */}
      {result && open && (
        <div
          onClick={() => {
            onCustomerSelect(result)
            setOpen(false)
          }
          }
          className="mt-6 bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-600 text-sm">{result.name}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-gray-400 text-lg">↳</span>
            <span className="text-lg font-semibold dark:text-black">
              {result.phone}
            </span>
          </div>
        </div>
      )}

      {/* Not Found → Add Customer */}
      {!loading && notFound && open && (
        <div
          onClick={() => {
            onCustomerSelect({ name: "", phone, points: 0, negativeReview: false, lastVisit: "", expiryDate: "", rewards: [], isNew: true }) // 🔥 pass empty name and phone for new customer
            setOpen(false)
          } // empty name for new
          }
          className="mt-6 bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition border border-dashed border-[#3b2a26]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3b2a26] text-white flex items-center justify-center text-lg">
              +
            </div>

            <div>
              <p className="font-semibold dark:text-black">Add New Customer</p>
              <p className="text-sm text-gray-500">
                {phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
