// services/admin/outlets.ts
export interface Outlet {
    id: string;
    name: string;
    brandId: string;
    address: string;
    phoneNumber: string;
    googleReviewUrl: string | null;
    managerWhatsappNumber: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ListOutletsResponse {
    message: string;
    data: Outlet[];
}
// Add to services/admin/outlet.ts

export interface CreateOutletInput {
    name: string;
    address: string;
    phoneNumber: string;
}

export const createOutlet = async (input: CreateOutletInput): Promise<{ data: Outlet }> => {
    const res = await fetch("/api/proxy/outlets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Could not create outlet.");
    return data as { data: Outlet };
};

export const listOutlets = async (): Promise<ListOutletsResponse> => {
    const res = await fetch("/api/proxy/outlets", {
        method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not fetch outlets.");
    }

    return data as ListOutletsResponse;
};

export interface UpdateOutletInput {
    name?: string;
    address?: string;
    phoneNumber?: string;
    googleReviewUrl?: string;
    managerWhatsappNumber?: string;
}

export interface OutletResponse {
    message: string;
    data: Outlet;
}

export const updateOutlet = async (
    outletId: string,
    input: UpdateOutletInput
): Promise<OutletResponse> => {
    const res = await fetch(`/api/proxy/admin/outlets/${outletId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Could not update outlet.");
    }

    return data as OutletResponse;
};