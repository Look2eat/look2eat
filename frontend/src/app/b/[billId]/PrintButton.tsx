"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-lg border border-[#e6ecf3] bg-white px-3 py-2 text-sm font-medium text-[#1D2033] shadow-sm hover:bg-[#f2f6fa]"
    >
      <Printer className="h-4 w-4" />
      Print
    </button>
  );
}
