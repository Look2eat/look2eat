"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    getLoyaltyHistory,
    type LoyaltyHistoryRow,
    type LoyaltyHistoryPagination,
} from "@/services/admin/loyalty"

interface ReedemTableProps {
    history: LoyaltyHistoryRow[];
    pagination: LoyaltyHistoryPagination | undefined;
    outletId: string;
    isInitialLoading?: boolean;
}

function RowSkeleton() {
    return (
        <tr className="border-b border-border/60">
            <td className="py-3 pr-4">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            </td>
            <td className="py-3 pr-4">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </td>
            <td className="py-3 pr-4">
                <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
            </td>
            <td className="py-3 text-right">
                <div className="h-4 w-10 rounded bg-muted animate-pulse ml-auto" />
            </td>
        </tr>
    )
}

export default function ReedemTable({
    history,
    pagination,
    outletId,
    isInitialLoading = false,
}: ReedemTableProps) {
    const [rows, setRows] = useState<LoyaltyHistoryRow[]>(history)
    const [page, setPage] = useState(pagination?.page ?? 1)
    const [totalPages, setTotalPages] = useState(pagination?.totalPages ?? 1)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // The parent's dashboard fetch resolves *after* this component has
    // already mounted (it mounts while isInitialLoading is still true,
    // so useState's initial value is empty/default). Sync local state
    // whenever fresh page-1 data actually arrives from the parent.
    useEffect(() => {
        if (isInitialLoading || !pagination) return
        setRows(history)
        setPage(pagination.page)
        setTotalPages(pagination.totalPages)
    }, [isInitialLoading, history, pagination])

    const goToPage = async (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
        setIsPageLoading(true)
        setError(null)
        try {
            const res = await getLoyaltyHistory(outletId, nextPage, pagination?.limit ?? 10)
            setRows(res.data)
            setPage(res.pagination.page)
            setTotalPages(res.pagination.totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load history.")
        } finally {
            setIsPageLoading(false)
        }
    }

    const showSkeletonRows = isInitialLoading

    return (
        <div>
            <Card className="bg-white dark:bg-[#121214]">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Rewards History </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <p className="text-sm text-destructive mb-4">{error}</p>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-3 pr-4 font-semibold">Date/Time</th>
                                    <th className="py-3 pr-4 font-semibold">Customer</th>
                                    <th className="py-3 pr-4 font-semibold">Action</th>
                                    <th className="py-3 font-semibold text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className={isPageLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
                                {showSkeletonRows
                                    ? Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                                    : rows.map((item) => {
                                        const isEarned = item.action === "Earned"
                                        return (
                                            <tr key={item.id} className="border-b border-border/60">
                                                <td className="py-3 pr-4 text-muted-foreground">
                                                    {new Date(item.date).toLocaleString()}
                                                </td>
                                                <td className="py-3 pr-4">{item.phoneNumber}</td>
                                                <td className="py-3 pr-4">
                                                    <span
                                                        className={
                                                            isEarned
                                                                ? "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                                                                : "inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400"
                                                        }
                                                    >
                                                        {item.action}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`py-3 text-right font-semibold ${isEarned
                                                        ? "text-emerald-700 dark:text-emerald-400"
                                                        : "text-amber-700 dark:text-amber-400"
                                                        }`}
                                                >
                                                    {item.points}
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {!showSkeletonRows && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1 || isPageLoading}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages || isPageLoading}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}