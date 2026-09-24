import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBill, type BillItem } from "@/lib/bill/fetchBill";
import PrintButton from "./PrintButton";

interface PageProps {
  params: Promise<{ billId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { billId } = await params;
  const result = await fetchBill(billId);
  return {
    title: result.status === "ok" ? `Bill · ${result.bill.billNumber}` : `Bill · ${billId}`,
    // Every bill is a distinct customer's private receipt — none of these
    // should be indexed, unlike the rest of the site.
    robots: { index: false, follow: false },
  };
}

const rupees = (n: number | null | undefined) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

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
  const { business, customer, items, amounts, loyalty } = bill;

  const issuedDate = new Date(bill.issuedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // The sample data always sets outlet === business name for a single-outlet
  // brand; only show it as a separate line when it actually says something
  // the name doesn't.
  const showOutlet = business.outlet && business.outlet !== business.name;

  // GST/HSN columns only earn their place in the table when the business
  // actually collects that detail — most Zuplin merchants (like this one)
  // don't, and an all-blank tax column is worse than no tax column.
  const hasTaxDetail = items.some(
    (i) => i.hsnSac || i.taxRate != null || i.cgst != null || i.sgst != null || i.igst != null,
  );

  const lineQty = (item: BillItem) => item.quantity;
  const lineRate = (item: BillItem) => item.unitPrice;
  const lineTotal = (item: BillItem) => item.amount;

  const hasDiscount = amounts.discount != null && amounts.discount > 0;
  const hasTax = amounts.taxAmount != null && amounts.taxAmount > 0;

  const hasLoyalty =
    loyalty &&
    (loyalty.coinsEarned || loyalty.coinsRedeemed || loyalty.cashbackApplied || loyalty.balance != null);

  return (
    <main className="min-h-screen bg-[#f2f6fa] px-4 py-8 print:bg-white print:p-0 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e6ecf3] bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
          {/* ── Header ── */}
          <div className="border-b border-[#e6ecf3] px-6 py-6 text-center sm:px-10">
            <div className="mb-2 flex items-center justify-center gap-2.5">
              {business.logoUrl ? (
                <Image
                  src={business.logoUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-cover"
                />
              ) : (
                <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
              )}
              <span className="text-lg font-semibold text-[#1D2033]">{business.name}</span>
            </div>
            {showOutlet && <p className="text-sm text-[#6B7180]">{business.outlet}</p>}
            {business.address && <p className="text-xs text-[#8D9098]">{business.address}</p>}
            <div className="mt-1 flex items-center justify-center gap-3 text-xs text-[#8D9098]">
              {business.phone && <span>{business.phone}</span>}
              {business.gstin && <span>GSTIN: {business.gstin}</span>}
            </div>
          </div>

          {/* ── Customer / date / bill no ── */}
          <div className="grid grid-cols-1 gap-3 border-b border-[#e6ecf3] px-6 py-4 text-sm sm:grid-cols-2 sm:px-10">
            <div>
              <p className="text-[#8D9098]">Billed to</p>
              <p className="font-medium text-[#1D2033]">{customer.name ?? "Walk-in customer"}</p>
              {customer.phone && <p className="text-[#6B7180]">{customer.phone}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-[#8D9098]">Bill No.</p>
              <p className="font-medium text-[#1D2033]">{bill.billNumber}</p>
              <p className="text-[#6B7180]">{issuedDate}</p>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="px-6 py-4 sm:px-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[#1D2033] text-left text-[#1D2033]">
                    <th className="w-8 py-2 font-semibold">#</th>
                    <th className="py-2 font-semibold">Item</th>
                    {hasTaxDetail && <th className="py-2 text-left font-semibold">HSN/SAC</th>}
                    <th className="py-2 text-right font-semibold">Qty</th>
                    <th className="py-2 text-right font-semibold">Rate</th>
                    {hasTaxDetail && <th className="py-2 text-right font-semibold">Tax</th>}
                    <th className="py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={`${item.name}-${i}`} className="border-b border-[#eef1f6]">
                      <td className="py-2.5 text-[#8D9098]">{i + 1}</td>
                      <td className="py-2.5 text-[#1D2033]">{item.name}</td>
                      {hasTaxDetail && (
                        <td className="py-2.5 text-[#6B7180]">{item.hsnSac ?? "—"}</td>
                      )}
                      <td className="py-2.5 text-right text-[#4A4F5E]">{lineQty(item)}</td>
                      <td className="py-2.5 text-right text-[#4A4F5E]">{rupees(lineRate(item))}</td>
                      {hasTaxDetail && (
                        <td className="py-2.5 text-right text-[#4A4F5E]">
                          {item.taxRate != null ? `${item.taxRate}%` : "—"}
                        </td>
                      )}
                      <td className="py-2.5 text-right font-medium text-[#1D2033]">
                        {rupees(lineTotal(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Totals ── */}
            <div className="mt-4 flex justify-end">
              <div className="flex w-full max-w-[260px] flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-[#6B7180]">
                  <span>Subtotal</span>
                  <span>{rupees(amounts.subtotal)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex items-center justify-between text-sm text-[#6B7180]">
                    <span>Discount</span>
                    <span>&minus;{rupees(amounts.discount)}</span>
                  </div>
                )}
                {hasTax && (
                  <div className="flex items-center justify-between text-sm text-[#6B7180]">
                    <span>Tax</span>
                    <span>{rupees(amounts.taxAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t-2 border-[#1D2033] pt-2">
                  <span className="font-semibold text-[#1D2033]">Grand Total</span>
                  <span className="text-lg font-bold text-[#1D2033]">{rupees(amounts.total)}</span>
                </div>
                {amounts.paymentMethod && (
                  <p className="text-right text-xs text-[#8D9098]">
                    Paid via {amounts.paymentMethod.toLowerCase()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Loyalty ── */}
          {hasLoyalty && (
            <div className="mx-6 mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl bg-[#f2f6fa] px-4 py-3 text-sm sm:mx-10">
              {!!loyalty!.coinsEarned && (
                <span className="text-[#1D2033]">
                  <span className="font-semibold text-[#2135DD]">+{loyalty!.coinsEarned}</span> coins earned
                </span>
              )}
              {!!loyalty!.coinsRedeemed && (
                <span className="text-[#1D2033]">
                  <span className="font-semibold">&minus;{loyalty!.coinsRedeemed}</span> coins redeemed
                </span>
              )}
              {!!loyalty!.cashbackApplied && (
                <span className="text-[#1D2033]">
                  <span className="font-semibold">{rupees(loyalty!.cashbackApplied)}</span> cashback applied
                </span>
              )}
              {loyalty!.balance != null && (
                <span className="text-[#6B7180]">
                  Balance: <span className="font-semibold text-[#1D2033]">{loyalty!.balance} coins</span>
                </span>
              )}
              {loyalty!.rewardName && <span className="text-[#6B7180]">Reward: {loyalty!.rewardName}</span>}
            </div>
          )}

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
