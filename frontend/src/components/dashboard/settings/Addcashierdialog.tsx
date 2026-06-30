"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOutlet } from "@/lib/auth/OutletContext";
import { createCashier } from "../../../services/admin/cashier";

const ALL_OUTLETS = "all";

export function AddCashierDialog({
    triggerClassName,
    onCreated,
}: {
    triggerClassName?: string;
    onCreated: () => void;
}) {
    const { selectedOutlet, outlets } = useOutlet();
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const currentOutlet = selectedOutlet === ALL_OUTLETS || selectedOutlet === ""
        ? null
        : outlets.find((o) => o.id === selectedOutlet);

    const outletDisplayName = currentOutlet?.name ?? "All Outlets";

    function handleOpenChange(open: boolean) {
        setOpen(open);
        if (open) {
            setName("");
            setPhone("");
            setPassword("");
            setShowPassword(false);
            setError(null);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!currentOutlet?.id || isSubmitting) return;
        console.log("Creating cashier for outlet:", currentOutlet);
        setIsSubmitting(true);
        setError(null);
        console.log({

            name: name,

            phone: phone,

            pass: password,

        });

        try {
            await createCashier({

                outletId: currentOutlet.id,
                phoneNumber: phone.trim(),
                name: name.trim(),
                password: password.trim(),
            });
            setOpen(false);
            onCreated(); // refetch list in TeamTab
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create cashier.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button className={triggerClassName ?? "text-xs"} />}>
                + Add Cashier
            </DialogTrigger>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Cashier</DialogTitle>
                    <DialogDescription>Create a new cashier login for your POS.</DialogDescription>
                </DialogHeader>
                <Form className="contents" onSubmit={handleSubmit} autoComplete="off">
                    <DialogPanel className="grid gap-4">
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <Field>
                            <FieldLabel>Outlet</FieldLabel>
                            <Input value={outletDisplayName} disabled className="cursor-not-allowed opacity-60" />
                        </Field>
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input
                                placeholder="Rohit Kumar"
                                value={name}
                                onChange={(e) => {
                                    console.log("typing", e.target.value);
                                    setName(e.target.value);
                                }}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <Input
                                placeholder="+91"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <div className="relative w-full">
                                <Input
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    className="pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-neutral-200 hover:text-gray-800 dark:hover:text-neutral-100"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </Field>
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit" loading={isSubmitting}>Add Cashier</Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}