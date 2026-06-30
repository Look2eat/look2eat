import { Suspense } from "react";
import CashierLoginClient from "../../../components/dashboard/cashierPanel/CashierLoginClient";

export default function CashierLoginPage() {
    return (
        <Suspense fallback={null}>
            <CashierLoginClient />
        </Suspense>
    );
}