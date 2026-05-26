"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function AddCashierDialog({ triggerClassName }: { triggerClassName?: string }) {
    return (
        <Dialog>
            <DialogTrigger render={<Button className={triggerClassName ?? "text-xs"} />}>
                + Add Cashier
            </DialogTrigger>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Cashier</DialogTitle>
                    <DialogDescription>Create a new cashier login for your POS.</DialogDescription>
                </DialogHeader>
                <Form className="contents">
                    <DialogPanel className="grid gap-4">
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input placeholder="Rohit Kumar" type="text" />
                        </Field>
                        <Field>
                            <FieldLabel>Username</FieldLabel>
                            <Input placeholder="rohit_k" type="text" />
                        </Field>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <Input placeholder="••••••••" type="password" />
                        </Field>
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit">Add Cashier</Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}