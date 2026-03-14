export interface MonthlySale {
    month: string
    revenue: number
}

export interface RepeatRateData {
    visit1: number
    visit2: number
    visit3to5: number
    visit6plus: number
}

export interface MonthlySalesResponse {
    monthlySales: MonthlySale[]
    monthlyAverage: number
}

export async function fetchMonthlySales(): Promise<MonthlySalesResponse> {

    await new Promise((r) => setTimeout(r, 400))

    const monthlySales: MonthlySale[] = [
        { month: "JAN", revenue: 2450000 },
        { month: "FEB", revenue: 2580000 },
        { month: "MAR", revenue: 2410000 },
        { month: "APR", revenue: 2490000 },
        { month: "MAY", revenue: 2630000 },
        { month: "JUN", revenue: 2700000 },
        { month: "JUL", revenue: 2520000 },
        { month: "AUG", revenue: 2440000 },
        { month: "SEP", revenue: 2660000 },
        { month: "OCT", revenue: 2710000 },
        { month: "NOV", revenue: 2590000 },
        { month: "DEC", revenue: 2680000 },
    ]

    const total = monthlySales.reduce((sum, item) => sum + item.revenue, 0)

    return {
        monthlySales,
        monthlyAverage: Math.round(total / monthlySales.length),
    }
}

export async function mockRepeatRate(): Promise<RepeatRateData> {

    await new Promise((r) => setTimeout(r, 400))

    return {
        visit1: 70,
        visit2: 23,
        visit3to5: 10,
        visit6plus: 5,
    }
}