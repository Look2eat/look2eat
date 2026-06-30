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
import { useAuth, type AuthUser } from "@/lib/auth/AuthContext";
import { updateProfile } from "@/services/admin/profile";

// ─────────────────────────────────────────────────────────────────
// Uses patchUser() from AuthContext rather than refresh() after a
// successful save. Reason: refresh() re-fetches /api/auth/me, which
// calls Express's /auth/me, which decodes the EXISTING JWT — that JWT
// was issued at login time with the old email/name baked in. The
// database update happened, but the JWT is stateless and doesn't know.
// patchUser() merges the new values directly into React state from the
// API response we already have, giving immediate UI consistency without
// a round-trip that would just return stale JWT claims anyway.
// ─────────────────────────────────────────────────────────────────

function EditNameDialog({
    currentName,
    onSaved,
}: {
    currentName: string;
    onSaved: (patch: Partial<AuthUser>) => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(currentName);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !name.trim()) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const res = await updateProfile({ name: name.trim() });
            onSaved({ name: res.data.name });
            setOpen(false); // close on success
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update name.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Name</DialogTitle>
                    <DialogDescription>Update your display name.</DialogDescription>
                </DialogHeader>
                <Form className="contents" onSubmit={handleSubmit}>
                    <DialogPanel className="grid gap-4">
                        {error && <p className="text-xs text-destructive">{error}</p>}
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                required
                            />
                        </Field>
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit" loading={isSubmitting}>Save</Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}

function EditEmailDialog({
    currentEmail,
    onSaved,
}: {
    currentEmail: string;
    onSaved: (patch: Partial<AuthUser>) => void;
}) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState(currentEmail);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !email.trim()) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const res = await updateProfile({ email: email.trim() });
            onSaved({ email: res.data.email });
            setOpen(false); // close on success
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not update email.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" className="text-xs" />}>Edit</DialogTrigger>
            <DialogPopup className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Email</DialogTitle>
                    <DialogDescription>A verification link will be sent to the new email.</DialogDescription>
                </DialogHeader>
                <Form className="contents" onSubmit={handleSubmit}>
                    <DialogPanel className="grid gap-4">
                        {error && <p className="text-xs text-destructive">{error}</p>}
                        <Field>
                            <FieldLabel>Email Address</FieldLabel>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </Field>
                    </DialogPanel>
                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                        <Button type="submit" loading={isSubmitting}>Save & Verify</Button>
                    </DialogFooter>
                </Form>
            </DialogPopup>
        </Dialog>
    );
}

export function ProfileTab() {
    const { user, isLoading, patchUser } = useAuth();

    if (isLoading) {
        return <div className="h-44 w-full animate-pulse rounded-[36px] bg-gray-100" />;
    }

    if (!user) return null;

    return (
        <div className="space-y-1">
            {/* Name */}
            <SectionRow
                title="Full Name"
                description="Your display name across the platform."
                action={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-neutral-200">{user.name}</span>
                        <EditNameDialog currentName={user.name} onSaved={patchUser} />
                    </div>
                }
            />

            {/* Email */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-900 py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Email Address</p>
                    <p className="mt-0.5 text-xs text-gray-700 dark:text-neutral-200">Used for billing and notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-700 dark:text-neutral-200">{user.email}</p>
                    </div>
                    <EditEmailDialog currentEmail={user.email} onSaved={patchUser} />
                </div>
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-900 py-5">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-200">Mobile Number</p>
                    <p className="mt-0.5 text-xs text-gray-700 dark:text-neutral-200">Used for logging and account alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-700 dark:text-neutral-200">+91 {user.phoneNumber}</p>
                    </div>
                </div>
            </div>

            {/* Role */}
            <SectionRow
                title="Role"
                description="Your role cannot be changed. Contact support to transfer ownership."
                action={
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {user.role}
                    </span>
                }
            />
        </div>
    );
}
