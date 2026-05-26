"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogDescription, DialogFooter,
    DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mockData } from "../../../lib/mock-settings";
import { SectionRow } from "./Shared";

export function BusinessTab() {
    const b = mockData.business;

    return (
        <div className=" space-y-1">
            {/* Business Name */}
            <SectionRow
                title="Business Name"
                description="Your brand name shown to customers."
                action={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-neutral-200">{b.name}</span>
                        <Dialog>
                            <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                            <DialogPopup className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Business Name</DialogTitle>
                                    <DialogDescription>Update your business name.</DialogDescription>
                                </DialogHeader>
                                <Form className="contents">
                                    <DialogPanel className="grid gap-4">
                                        <Field>
                                            <FieldLabel>Business Name</FieldLabel>
                                            <Input defaultValue={b.name} type="text" />
                                        </Field>
                                    </DialogPanel>
                                    <DialogFooter>
                                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                        <Button type="submit">Save</Button>
                                    </DialogFooter>
                                </Form>
                            </DialogPopup>
                        </Dialog>
                    </div>
                }
            />

            {/* Logo */}
            <div className="flex items-center justify-between border-b border-gray-100  dark:border-neutral-900 py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Business Logo</p>
                    <p className="mt-0.5 text-xs text-gray-400">PNG or JPG, max 2MB. Shown on receipts and portal.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow">
                        Z
                    </div>
                    <Dialog>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Upload</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Upload Logo</DialogTitle>
                                <DialogDescription>Upload a square PNG or JPG under 2MB.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents">
                                <DialogPanel className="grid gap-4">
                                    <Field>
                                        <FieldLabel>Logo File</FieldLabel>
                                        <Input type="file" accept="image/png,image/jpeg" />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit">Upload</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            </div>

            {/* GST */}
            <SectionRow
                title="GST Number"
                description="Your GSTIN for tax invoices."
                action={
                    <Dialog>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>GST Number</DialogTitle>
                                <DialogDescription>Enter your 15-digit GSTIN.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents">
                                <DialogPanel className="grid gap-4">
                                    <Field>
                                        <FieldLabel>GSTIN</FieldLabel>
                                        <Input defaultValue={b.gst} type="text" />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit">Save</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                }
            />

            {/* Address */}
            <div className="flex items-center justify-between py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Business Address</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                        {b.addressLine1}, {b.addressLine2}, {b.city}, {b.state} – {b.pincode}
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                    <DialogPopup className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Business Address</DialogTitle>
                            <DialogDescription>Update your registered business address.</DialogDescription>
                        </DialogHeader>
                        <Form className="contents">
                            <DialogPanel className="grid gap-4">
                                <Field>
                                    <FieldLabel>Address Line 1</FieldLabel>
                                    <Input defaultValue={b.addressLine1} type="text" />
                                </Field>
                                <Field>
                                    <FieldLabel>Address Line 2</FieldLabel>
                                    <Input defaultValue={b.addressLine2} type="text" />
                                </Field>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>City</FieldLabel>
                                        <Input defaultValue={b.city} type="text" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>State</FieldLabel>
                                        <Input defaultValue={b.state} type="text" />
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel>Pincode</FieldLabel>
                                    <Input defaultValue={b.pincode} type="text" />
                                </Field>
                            </DialogPanel>
                            <DialogFooter>
                                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </Form>
                    </DialogPopup>
                </Dialog>
            </div>
        </div>
    );
}