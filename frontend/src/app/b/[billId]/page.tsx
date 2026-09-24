import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBill } from "@/lib/bill/fetchBill";
import PrintButton from "./PrintButton";

interface PageProps {
  params: Promise<{ billId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { billId } = await params;
  return {
    title: `Bill · ${billId}`,
    // Every bill is a distinct customer's private receipt — none of these
    // should be indexed, unlike the rest of the site.
    robots: { index: false, follow: false },
  };
}

const formatRupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function BillPage({ params }: PageProps) {
  const { billId } = await params;
  const result = await fetchBill(billId);

  if (result.status === "not-found") notFound();

  if (result.status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2f6fa] px-6">
        <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="mb-1 font-semibold text-[#1D2033]">Couldn&rsquo;t load this bill</p>
          <p className="text-sm text-[#6B7180]">{result.message}</p>
        </div>
      </main>
    );
  }

  const { bill } = result;
  const date = bill.createdAt
    ? new Date(bill.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f2f6fa] px-4 py-8 print:bg-white print:p-0 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6ecf3] bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          {/* ── Header ── */}
          <div className="border-b border-[#e6ecf3] px-6 py-6 text-center sm:px-10">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
              <span className="text-lg font-semibold text-[#1D2033]">
                {bill.brandName ?? "Zuplin"}
              </span>
            </div>
            {bill.outletName && <p className="text-sm text-[#6B7180]">{bill.outletName}</p>}
            {bill.gstNo && <p className="mt-1 text-xs text-[#8D9098]">GSTIN: {bill.gstNo}</p>}
          </div>

          {/* ── Customer / date / bill no ── */}
          <div className="grid grid-cols-1 gap-3 border-b border-[#e6ecf3] px-6 py-4 text-sm sm:grid-cols-2 sm:px-10">
            <div>
              <p className="text-[#8D9098]">Billed to</p>
              <p className="font-medium text-[#1D2033]">{bill.customerName ?? "Walk-in customer"}</p>
              {bill.customerPhone && <p className="text-[#6B7180]">{bill.customerPhone}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-[#8D9098]">Bill No.</p>
              <p className="font-medium text-[#1D2033]">{bill.billId}</p>
              {date && <p className="text-[#6B7180]">{date}</p>}
            </div>
          </div>

          {/* ── Items ── */}
          <div className="px-6 py-4 sm:px-10">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-[#1D2033] text-left text-[#1D2033]">
                  <th className="w-10 py-2 font-semibold">#</th>
                  <th className="py-2 font-semibold">Item</th>
                  <th className="py-2 text-right font-semibold">Qty</th>
                  <th className="py-2 text-right font-semibold">Rate</th>
                  <th className="py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, i) => (
                  <tr key={`${item.name}-${i}`} className="border-b border-[#eef1f6]">
                    <td className="py-2.5 text-[#8D9098]">{i + 1}</td>
                    <td className="py-2.5 text-[#1D2033]">{item.name}</td>
                    <td className="py-2.5 text-right text-[#4A4F5E]">{item.qty}</td>
                    <td className="py-2.5 text-right text-[#4A4F5E]">{formatRupees(item.amount)}</td>
                    <td className="py-2.5 text-right font-medium text-[#1D2033]">
                      {formatRupees(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end border-t-2 border-[#1D2033] pt-3">
              <div className="flex w-full max-w-[220px] items-center justify-between">
                <span className="font-semibold text-[#1D2033]">Grand Total</span>
                <span className="text-lg font-bold text-[#1D2033]">
                  {formatRupees(bill.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="border-t border-[#e6ecf3] px-6 py-4 text-center text-xs text-[#8D9098] sm:px-10">
            Thank you for your purchase.
            <br className="print:hidden" />
            <span className="print:hidden"> Powered by Zuplin.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
