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
import { mockData } from "../../../lib/mock-settings";
import { VerifiedBadge, SectionRow } from "./Shared";

export function ProfileTab() {
    const p = mockData.profile;
    const [name, setName] = useState(p.name);

    return (
        <div className="space-y-1">
            {/* Name */}
            <SectionRow
                title="Full Name"
                description="Your display name across the platform."
                action={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-neutral-200">{name}</span>
                        <Dialog>
                            <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                            <DialogPopup className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Edit Name</DialogTitle>
                                    <DialogDescription>Update your display name.</DialogDescription>
                                </DialogHeader>
                                <Form className="contents">
                                    <DialogPanel className="grid gap-4">
                                        <Field>
                                            <FieldLabel>Full Name</FieldLabel>
                                            <Input value={name} onChange={(e) => setName(e.target.value)} type="text" />
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

            {/* Email */}
            <div className="flex items-center justify-between border-b border-gray-100  dark:border-neutral-900 py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Email Address</p>
                    <p className="mt-0.5 text-xs text-gray-700 dark:text-neutral-200">Used for login and notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-700 dark:text-neutral-200">{p.email}</p>
                        <VerifiedBadge verified={p.emailVerified} />
                    </div>
                    <Dialog>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Edit Email</DialogTitle>
                                <DialogDescription>A verification link will be sent to the new email.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents">
                                <DialogPanel className="grid gap-4">
                                    <Field>
                                        <FieldLabel>Email Address</FieldLabel>
                                        <Input defaultValue={p.email} type="email" />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit">Save & Verify</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-900 py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Mobile Number</p>
                    <p className="mt-0.5 text-xs text-gray-700 dark:text-neutral-200">For OTP and account alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-700 dark:text-neutral-200">{p.mobile}</p>
                        <VerifiedBadge verified={p.mobileVerified} />
                    </div>
                    <Dialog>
                        <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
                        <DialogPopup className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Edit Mobile</DialogTitle>
                                <DialogDescription>An OTP will be sent to verify your new number.</DialogDescription>
                            </DialogHeader>
                            <Form className="contents">
                                <DialogPanel className="grid gap-4">
                                    <Field>
                                        <FieldLabel>Mobile Number</FieldLabel>
                                        <Input defaultValue={p.mobile} type="tel" />
                                    </Field>
                                </DialogPanel>
                                <DialogFooter>
                                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                    <Button type="submit">Save & Verify</Button>
                                </DialogFooter>
                            </Form>
                        </DialogPopup>
                    </Dialog>
                </div>
            </div>

            {/* Role */}
            <SectionRow
                title="Role"
                description="Your role cannot be changed. Contact support to transfer ownership."
                action={
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {p.role}
                    </span>
                }
            />
        </div>
    );
}