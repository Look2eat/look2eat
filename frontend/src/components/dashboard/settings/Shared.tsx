// Shared primitives reused across settings tabs

export function VerifiedBadge({ verified }: { verified: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${verified ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                } ${verified ? "dark:bg-emerald-500/40 dark:text-neutral-100" : "dark:bg-red-500/40 dark:text-neutral-100"
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${verified ? "bg-emerald-500" : "bg-red-400"}`} />
            {verified ? "Verified" : "Unverified"}
        </span>
    );
}

export function SectionRow({
    title,
    description,
    action,
    value,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
    value?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100  dark:border-neutral-900 py-5 last:border-0">
            <div>
                <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">{title}</p>
                <p className="mt-0.5 text-xs text-gray-700 dark:text-neutral-200">{description}</p>
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-3">
                {value && <span className="text-sm text-gray-700">{value}</span>}
                {action}
            </div>
        </div>
    );
}