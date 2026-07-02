"use client";

import { useState } from "react";
import { useOutlet } from "../../lib/auth/OutletContext";
import { createOutlet } from "../../services/admin/outlet";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RequiredOutletDialog() {
    const { outlets, isLoading, addOutlet } = useOutlet();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const open = !isLoading && outlets.length === 0;

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
            addOutlet(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create outlet.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Your First Outlet</DialogTitle>
                    <DialogDescription>
                        You need at least one outlet before you can use the dashboard.
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
                        <Button type="submit" loading={isSubmitting} className="w-full">
                            Create Outlet
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}