interface Props {
    name: string
}

export default function DashboardHeader({ name }: Props) {
    return (
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-semibold">
                Welcome Back, <span className="font-bold">{name}</span>
            </h1>

            <button className="bg-white px-5 py-2 rounded-xl shadow-sm flex items-center gap-2">
                Today
                <span>⌄</span>
            </button>
        </div>
    )
}