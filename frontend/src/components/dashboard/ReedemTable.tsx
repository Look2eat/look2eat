import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
interface RewardHistoryRow {
    id: string;
    dateTime: string;
    customerName: string;
    action: "earned" | "redeemed";
    pointsDelta: number;
}
interface ReedemTableProps {
    history: RewardHistoryRow[]
}


export default function ReedemTable({ history }: ReedemTableProps) {
    return (
        <div>
            <Card className="bg-muted/40 border border-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:bg-foreground/[0.04] hover:border-foreground/[0.1]">
                <CardHeader>
                    <CardTitle>Rewards History </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-3 pr-4 font-semibold">Date/Time</th>
                                    <th className="py-3 pr-4 font-semibold">Customer</th>
                                    <th className="py-3 pr-4 font-semibold">Action</th>
                                    <th className="py-3 font-semibold text-right">Points Delta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className="border-b border-border/60">
                                        <td className="py-3 pr-4 text-muted-foreground">{item.dateTime}</td>
                                        <td className="py-3 pr-4">{item.customerName}</td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={
                                                    item.action === "earned"
                                                        ? "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                                                        : "inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
                                                }
                                            >
                                                {item.action === "earned" ? "Earned" : "Redeemed"}
                                            </span>
                                        </td>
                                        <td
                                            className={`py-3 text-right font-semibold ${item.pointsDelta > 0
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : "text-amber-700 dark:text-amber-400"
                                                }`}
                                        >
                                            {item.pointsDelta > 0 ? "+" : ""}
                                            {item.pointsDelta}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}