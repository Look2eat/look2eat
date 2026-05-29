import CashierMainScreen from '@/components/dashboard/cashierPanel/CashierMainScreen'
import React from 'react'

function page() {
    return (
        <div className=" px-6 py-6 font-poppins">
            <div>
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#1D2033] dark:text-[#FDFEFF]">Account Settings</h1>
                <CashierMainScreen /></div>
        </div>
    )
}

export default page