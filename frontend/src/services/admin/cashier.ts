/**
 * Cashier management calls via authenticated proxy
 * (/api/proxy/...), which attaches the JWT from the httpOnly
 * cookie as Authorization: Bearer server-side.
 */

export interface CreateCashierInput {
    outletId: string;
    phoneNumber: string;
    name: string;
    password: string;
}

export interface Cashier {
    id: string;
    name: string;
    phoneNumber: string;
    outletId: string;  // this is the outlet's UUID id
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCashierResponse {
    message: string;
    data: Cashier;
}

export interface ListCashiersResponse {
    message: string;
    data: Cashier[];
}

export interface ToggleCashierResponse {
    message: string;
    data: Cashier;
}

// ── List ──────────────────────────────────────────────────────────
export const listCashiersByOutlet = async (
    outletId: string
): Promise<ListCashiersResponse> => {
    const res = await fetch(`/api/proxy/admin/outlets/${outletId}/cashiers`, {
        method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not fetch cashiers.");
    }

    return data as ListCashiersResponse;
};

// ── Create ────────────────────────────────────────────────────────
export const createCashier = async (
    input: CreateCashierInput
): Promise<CreateCashierResponse> => {
    const res = await fetch("/api/proxy/admin/cashiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not create cashier.");
    }

    return data as CreateCashierResponse;
};

// ── Deactivate ────────────────────────────────────────────────────
export const deactivateCashier = async (
    cashierId: string
): Promise<ToggleCashierResponse> => {
    const res = await fetch(`/api/proxy/admin/cashiers/${cashierId}/deactivate`, {
        method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not deactivate cashier.");
    }

    return data as ToggleCashierResponse;
};

// ── Reactivate ────────────────────────────────────────────────────
export const reactivateCashier = async (
    cashierId: string
): Promise<ToggleCashierResponse> => {
    const res = await fetch(`/api/proxy/admin/cashiers/${cashierId}/reactivate`, {
        method: "PATCH",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not reactivate cashier.");
    }

    return data as ToggleCashierResponse;
};