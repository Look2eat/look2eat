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

export function SecurityTab() {
    const [twoFA, setTwoFA] = useState(mockData.security.twoFA);

    return (
        <div className=" space-y-1">
            {/* Change Password */}
            <div className="flex items-center justify-between border-b border-gray-100 py-5 dark:border-neutral-900">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Password</p>
                    <p className="mt-0.5 text-xs text-gray-400">Set a unique password to protect your account.</p>
                </div>
                <Dialog>
                    <DialogTrigger render={<Button variant="outline" className="text-xs" />}>
                        Change Password
                    </DialogTrigger>
                    <DialogPopup className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                        </DialogHeader>
                        <Form className="contents">
                            <DialogPanel className="grid gap-4">
                                <Field>
                                    <FieldLabel>Current Password</FieldLabel>
                                    <Input type="password" placeholder="••••••••" />
                                </Field>
                                <Field>
                                    <FieldLabel>New Password</FieldLabel>
                                    <Input type="password" placeholder="••••••••" />
                                </Field>
                                <Field>
                                    <FieldLabel>Confirm New Password</FieldLabel>
                                    <Input type="password" placeholder="••••••••" />
                                </Field>
                            </DialogPanel>
                            <DialogFooter>
                                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                <Button type="submit">Update Password</Button>
                            </DialogFooter>
                        </Form>
                    </DialogPopup>
                </Dialog>
            </div>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between border-b border-gray-100 py-5 dark:border-neutral-900">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">2-Step Verification</p>
                    <p className="mt-0.5 text-xs text-gray-400">Add an extra layer of security with OTP on login.</p>
                </div>
                <button
                    role="switch"
                    aria-checked={twoFA}
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${twoFA ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${twoFA ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Delete Account</p>
                    <p className="mt-0.5 text-xs text-gray-400">Permanently delete your account and all associated data.</p>
                </div>
                <Dialog>
                    <DialogTrigger
                        render={<Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 text-xs dark:border-red-700/20 dark:bg-red-500/70 dark:text-red-50" />}
                    >
                        Request Deletion
                    </DialogTrigger>
                    <DialogPopup className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                This action is irreversible. All your data, cashiers, and billing history will be permanently
                                removed. Type <strong>DELETE</strong> to confirm.
                            </DialogDescription>
                        </DialogHeader>
                        <Form className="contents">
                            <DialogPanel className="grid gap-4">
                                <Field>
                                    <FieldLabel>Type DELETE to confirm</FieldLabel>
                                    <Input type="text" placeholder="DELETE" />
                                </Field>
                            </DialogPanel>
                            <DialogFooter>
                                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                                    Delete My Account
                                </Button>
                            </DialogFooter>
                        </Form>
                    </DialogPopup>
                </Dialog>
            </div>
        </div>
    );
}