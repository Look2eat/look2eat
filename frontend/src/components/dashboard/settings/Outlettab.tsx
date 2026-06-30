"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionRow } from "./Shared";
import { useOutlet } from "@/lib/auth/OutletContext";
import { updateOutlet, createOutlet } from "../../../services/admin/outlet";
import { type Outlet } from "../../../services/admin/outlet";

// ── Shared types ──────────────────────────────────────────────────

type DialogProps = {
    outlet: Outlet;
    patchOutlet: (id: string, patch: Partial<Outlet>) => void;
};

// ── Add Outlet Dialog ─────────────────────────────────────────────

function AddOutletDialog({ onCreated }: { onCreated: (outlet: Outlet) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => { setName(""); setAddress(""); setPhone(""); setError(null); };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting || !name.trim() || !address.trim() || !phone.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await createOutlet({
                name: name.trim(),
                address: address.trim(),
                phoneNumber: phone.trim(),
            });
            onCreated(res.data);
            setOpen(false);
            reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create outlet.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger render={<div className="flex w-full items-end justify-end"><Button variant="outline" className="gap-2">+ Add Outlet</Button></div>}>
            </DialogTrigger>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add New Outlet</DialogTitle>
                    <DialogDescription>
                        Create a new outlet for your brand.
                    </DialogDescription>
                </DialogHeader>
                <Form className="contents" onSubmit={handleSubmit}>
                    <DialogPanel className="grid gap-4">
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <Field>
                            <FieldLabel>Outlet Name</FieldLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Pizza Palace HSR Layout"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Address</FieldLabel>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                placeholder="123, 27th Main Road, Bengaluru"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                type="tel"
                                placeholder="9876543210"
                                required
                            />
                        </Field>
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit" loading={isSubmitting}>Create Outlet</Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}

// ── Empty state ───────────────────────────────────────────────────

function NoOutletState({ onCreated }: { onCreated: (outlet: Outlet) => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800 text-2xl">
                🏪
            </div>
            <div>
                <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">No outlets yet</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Add your first outlet to get started.
                </p>
            </div>
            <AddOutletDialog onCreated={onCreated} />
        </div>
    );
}

// ── Main Tab ──────────────────────────────────────────────────────

export function OutletTab() {
    const { selectedOutlet, outlets, patchOutlet, addOutlet } = useOutlet();
    const o = outlets.find((outlet) => outlet.id === selectedOutlet);

    // No outlets at all — show centered empty state
    if (outlets.length === 0) {
        return <NoOutletState onCreated={addOutlet} />;
    }

    // Outlets exist but none selected (e.g. "all" is selected)
    if (!o) {
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-center py-16 text-sm text-gray-500 dark:text-neutral-400">
                    Please select a specific outlet to view its details.
                </div>

            </div>
        );
    }

    return (
        <div className="space-y-1">
            {/* Outlet Name */}
            <OutletNameDialog outlet={o} patchOutlet={patchOutlet} />

            {/* Outlet Address */}
            <OutletAddressDialog outlet={o} patchOutlet={patchOutlet} />

            {/* Phone Number */}
            <OutletPhoneDialog outlet={o} patchOutlet={patchOutlet} />

            {/* Google Review URL */}
            <OutletGoogleReviewDialog outlet={o} patchOutlet={patchOutlet} />

            {/* Manager WhatsApp */}
            <OutletWhatsappDialog outlet={o} patchOutlet={patchOutlet} />

            {/* Add outlet button at the bottom */}
            <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                <AddOutletDialog onCreated={addOutlet} />
            </div>
        </div>
    );
}

// ── Name ──────────────────────────────────────────────────────────

function OutletNameDialog({ outlet, patchOutlet }: DialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(outlet.name);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting || !name.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await updateOutlet(outlet.id, { name: name.trim() });
            patchOutlet(outlet.id, { name: res.data.name });
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SectionRow
            title="Outlet Name"
            description="The name of this outlet shown to customers."
            action={
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-neutral-200">{outlet.name}</span>
                    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setName(outlet.name); setError(null); } }}>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Outlet Name</DialogTitle>
                                <DialogDescription>Update the name of this outlet.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents" onSubmit={handleSubmit}>
                                <DialogPanel className="grid gap-4">
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <Field>
                                        <FieldLabel>Outlet Name</FieldLabel>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit" loading={isSubmitting}>Save</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            }
        />
    );
}

// ── Address ───────────────────────────────────────────────────────

function OutletAddressDialog({ outlet, patchOutlet }: DialogProps) {
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState(outlet.address);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting || !address.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await updateOutlet(outlet.id, { address: address.trim() });
            patchOutlet(outlet.id, { address: res.data.address });
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-between py-5">
            <div>
                <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Outlet Address</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-200">{outlet.address}</p>
            </div>
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setAddress(outlet.address); setError(null); } }}>
                <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                <DialogPopup className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Outlet Address</DialogTitle>
                        <DialogDescription>Update the address for this outlet.</DialogDescription>
                    </DialogHeader>
                    <Form className="contents" onSubmit={handleSubmit}>
                        <DialogPanel className="grid gap-4">
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <Field>
                                <FieldLabel>Address</FieldLabel>
                                <Input value={address} onChange={(e) => setAddress(e.target.value)} type="text" required />
                            </Field>
                        </DialogPanel>
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                            <Button type="submit" loading={isSubmitting}>Save</Button>
                        </DialogFooter>
                    </Form>
                </DialogPopup>
            </Dialog>
        </div>
    );
}

// ── Phone ─────────────────────────────────────────────────────────

function OutletPhoneDialog({ outlet, patchOutlet }: DialogProps) {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState(outlet.phoneNumber);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting || !phone.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await updateOutlet(outlet.id, { phoneNumber: phone.trim() });
            patchOutlet(outlet.id, { phoneNumber: res.data.phoneNumber });
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SectionRow
            title="Phone Number"
            description="Contact number for this outlet."
            action={
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-neutral-200">{outlet.phoneNumber}</span>
                    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setPhone(outlet.phoneNumber); setError(null); } }}>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Phone Number</DialogTitle>
                                <DialogDescription>Update the contact number for this outlet.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents" onSubmit={handleSubmit}>
                                <DialogPanel className="grid gap-4">
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <Field>
                                        <FieldLabel>Phone Number</FieldLabel>
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit" loading={isSubmitting}>Save</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            }
        />
    );
}

// ── Google Review URL ─────────────────────────────────────────────

function OutletGoogleReviewDialog({ outlet, patchOutlet }: DialogProps) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState(outlet.googleReviewUrl ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await updateOutlet(outlet.id, { googleReviewUrl: url.trim() });
            patchOutlet(outlet.id, { googleReviewUrl: res.data.googleReviewUrl });
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SectionRow
            title="Google Review URL"
            description="Direct link for customers to leave a Google review."
            action={
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-neutral-200 truncate max-w-[180px]">
                        {outlet.googleReviewUrl || "Not set"}
                    </span>
                    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setUrl(outlet.googleReviewUrl ?? ""); setError(null); } }}>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Google Review URL</DialogTitle>
                                <DialogDescription>Paste the Google Maps review link for this outlet.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents" onSubmit={handleSubmit}>
                                <DialogPanel className="grid gap-4">
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <Field>
                                        <FieldLabel>Review URL</FieldLabel>
                                        <Input value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="https://g.page/r/..." />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit" loading={isSubmitting}>Save</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            }
        />
    );
}

// ── Manager WhatsApp ──────────────────────────────────────────────

function OutletWhatsappDialog({ outlet, patchOutlet }: DialogProps) {
    const [open, setOpen] = useState(false);
    const [whatsapp, setWhatsapp] = useState(outlet.managerWhatsappNumber ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await updateOutlet(outlet.id, { managerWhatsappNumber: whatsapp.trim() });
            patchOutlet(outlet.id, { managerWhatsappNumber: res.data.managerWhatsappNumber });
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SectionRow
            title="Manager WhatsApp"
            description="WhatsApp number for outlet manager alerts."
            action={
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-neutral-200">
                        {outlet.managerWhatsappNumber || "Not set"}
                    </span>
                    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setWhatsapp(outlet.managerWhatsappNumber ?? ""); setError(null); } }}>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Manager WhatsApp</DialogTitle>
                                <DialogDescription>Update the WhatsApp number for this outlet&apos;s manager.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents" onSubmit={handleSubmit}>
                                <DialogPanel className="grid gap-4">
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <Field>
                                        <FieldLabel>WhatsApp Number</FieldLabel>
                                        <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} type="tel" placeholder="9900887766" />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit" loading={isSubmitting}>Save</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            }
        />
    );
}