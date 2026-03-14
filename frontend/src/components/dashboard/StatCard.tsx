interface Props {
    title: string
    value?: string | number
    className?: string
}

export default function StatCard({ title, value, className }: Props) {
    return (
        <div
            className={`bg-muted/60 border border-foreground/[0.06] backdrop-blur-sm transition-all duration-500 hover:bg-foreground/[0.04] hover:border-foreground/[0.1] rounded-2xl p-6 flex flex-col justify-between ${className}`}
        >
            <h3 className="text-md font-bold  tracking-wide uppercase">{title}</h3>

            {value && (
                <p className="text-3xl font-bold mt-6">
                    {value}
                </p>
            )}
        </div>
    )
}