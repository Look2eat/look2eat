"use client";

import { Customer } from "@/types/customer";
import { useState } from "react";
import RedeemConfirmationModal from "./Confiramtion";
import PosOrderPanel, { type CartLine } from "./PosOrderPanel";
import { processPosPurchase, processStandardPurchase } from "@/services/cashier/transactions";

interface Props {
  customer: Customer;
  onSuccess: () => void;
  brandId: string;
}

type BillMode = "products" | "amount";

export default function CustomerForm({ customer, onSuccess, brandId }: Props) {
  const [isChecked, setIsChecked] = useState(true);
  const [name, setName] = useState(customer.name);

  // "products" — POS picker, the default. "amount" — the original free-text
  // bill field, kept as an escape hatch for anything not in the catalogue
  // (services, custom orders, a discount that doesn't map to a line item).
  const [mode, setMode] = useState<BillMode>("products");
  const [amount, setAmount] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [billId, setBillId] = useState<string | undefined>(undefined);

  const isAmountValid = mode === "amount" ? Boolean(amount) && Number(amount) > 0 : cartTotal > 0;

  const handleSubmit = async () => {
    if (!isAmountValid) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "products") {
        const items = cart.map((line) => ({
          name: line.name,
          amount: line.amount,
          qty: line.qty,
          total: line.amount * line.qty,
        }));
        const res = await processPosPurchase(customer.phone, brandId, items, name, "CASH");
        setCoinsEarned(res.data.coinsEarned);
        setBillId(res.data.billId ?? res.data.id);
      } else {
        const res = await processStandardPurchase(customer.phone, brandId, Number(amount), name);
        setCoinsEarned(res.data.coinsEarned);
        setBillId(undefined);
      }
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.10)]">
      <label className="block mb-2 font-medium dark:text-black">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl px-4 py-3 mb-4 bg-gray-200/50  dark:text-black outline-0"
        placeholder="Enter Customer Name"
      />

      {/*
        Fixed literal colours rather than gray-100/gray-500: this app remaps
        some gray shades to near-black under dark mode for dashboard
        surfaces, which would make the inactive tab's text unreadable here.
        See the matching note in PosOrderPanel.tsx.
      */}
      <div className="mb-4 flex gap-2 rounded-xl bg-[#f2f6fa] p-1">
        <button
          type="button"
          onClick={() => setMode("products")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "products" ? "bg-white text-[#1D2033] shadow-sm" : "text-[#6B7180]"
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => setMode("amount")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "amount" ? "bg-white text-[#1D2033] shadow-sm" : "text-[#6B7180]"
          }`}
        >
          Custom amount
        </button>
      </div>

      {mode === "products" ? (
        <div className="mb-4">
          <PosOrderPanel
            onCartChange={(lines, total) => {
              setCart(lines);
              setCartTotal(total);
            }}
          />
        </div>
      ) : (
        <>
          <label className="block mb-2 font-medium dark:text-black ">Bill Amount</label>
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
            <input
              value={amount}
              inputMode="numeric"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              placeholder="0.00 (Enter bill amount after discount)"
              className="w-full bg-gray-200/50 rounded-xl pl-10 pr-4 py-4 text-lg focus:outline-none dark:text-black
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="bg-white border-gray-300 accent-blue-600"
        />
        <p className="text-sm text-gray-600">Customer agrees to receive WhatsApp updates</p>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        disabled={!isAmountValid || loading}
        onClick={handleSubmit}
        className={`w-full py-3 rounded-xl text-white transition-all duration-200
          ${isAmountValid && !loading ? "bg-[#3b2a26] hover:opacity-90" : "bg-[#3b2a26] opacity-50 cursor-not-allowed"}`}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      <RedeemConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        coinsEarned={coinsEarned}
        customerName={name}
        billId={billId}
        onConfirm={onSuccess}
      />
    </div>
  );
}
