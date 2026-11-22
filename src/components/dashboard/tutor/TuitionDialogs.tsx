"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { apiDelete, apiPatch } from "@/lib/actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// The shape of one tuition returned by the API.
// Shared by the my-tuitions page and the three dialogs below.
export interface Tuition {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: string;
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
    approvalStatus: "pending" | "approved" | "rejected";
    isActive: boolean;
    tutorName: string;
    tutorEmail: string;
    // Attached by the API: the tutor's current plan ("pro" | "free").
    tutorPlan?: string;
    createdAt: string;
}

// =============================================================
// VIEW dialog - read-only details of one tuition post.
// The page only renders this while a tuition is selected, so we
// can take the tuition as a required prop and start "open".
// =============================================================
export function ViewTuitionDialog({
    tuition,
    onOpenChange,
}: {
    tuition: Tuition;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{tuition.title}</DialogTitle>
                    <DialogDescription>
                        {tuition.subject} &middot; {tuition.classLevel}
                    </DialogDescription>
                </DialogHeader>

                {/* Banner (only when a valid URL exists) */}
                {tuition.bannerImage.startsWith("http") && (
                    <Image
                        src={tuition.bannerImage}
                        alt={tuition.title}
                        width={600}
                        height={200}
                        className="h-40 w-full rounded-lg object-cover"
                    />
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant="outline"
                        className="capitalize"
                    >
                        {tuition.approvalStatus}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={
                            tuition.isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }
                    >
                        {tuition.isActive ? "Active" : "Close"}
                    </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-muted-foreground">Mode</p>
                        <p className="font-medium capitalize">{tuition.mode}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">
                            {tuition.mode === "offline" && tuition.location
                                ? tuition.location
                                : "Online"}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Monthly Fee</p>
                        <p className="font-medium">৳{tuition.monthlyFee}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Days Per Week</p>
                        <p className="font-medium">{tuition.daysPerWeek}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-muted-foreground">Posted On</p>
                        <p className="font-medium">
                            {new Date(tuition.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p className="whitespace-pre-wrap">
                        {tuition.description || "No description provided."}
                    </p>
                </div>

                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}

// =============================================================
// EDIT dialog - the same fields as the post-tuition form,
// prefilled with the selected tuition. Saves via PATCH.
// =============================================================
export function EditTuitionDialog({
    tuition,
    onOpenChange,
    onSaved,
}: {
    tuition: Tuition;
    onOpenChange: (open: boolean) => void;
    onSaved: (updated: Tuition) => void;
}) {
    // Start the form from the tuition we were opened with.
    // (The dialog unmounts on close, so no reset logic is needed.)
    const [form, setForm] = useState({
        title: tuition.title,
        subject: tuition.subject,
        classLevel: tuition.classLevel,
        mode: tuition.mode,
        location: tuition.location,
        monthlyFee: String(tuition.monthlyFee),
        daysPerWeek: String(tuition.daysPerWeek),
        bannerImage: tuition.bannerImage,
        description: tuition.description,
        isActive: tuition.isActive,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Same required fields the backend validates
        if (
            !form.title.trim() ||
            !form.subject.trim() ||
            !form.classLevel.trim() ||
            !form.monthlyFee
        ) {
            toast.error("Title, subject, class level and monthly fee are required.");
            return;
        }

        try {
            setIsSaving(true);

            const updated = await apiPatch<Tuition>(
                `/api/tuitions/${tuition._id}`,
                {
                    title: form.title.trim(),
                    subject: form.subject.trim(),
                    classLevel: form.classLevel.trim(),
                    mode: form.mode,
                    location: form.location.trim(),
                    monthlyFee: Number(form.monthlyFee),
                    daysPerWeek: Number(form.daysPerWeek) || 0,
                    bannerImage: form.bannerImage.trim(),
                    description: form.description.trim(),
                    isActive: form.isActive,
                }
            );

            toast.success("Tuition updated.");
            onSaved(updated); // page replaces the row and closes the dialog
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update tuition."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Tuition</DialogTitle>
                    <DialogDescription>
                        Update the details of your tuition post.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                            id="edit-title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Subject + Class level */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-subject">Subject *</Label>
                            <Input
                                id="edit-subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-classLevel">Class Level *</Label>
                            <Input
                                id="edit-classLevel"
                                name="classLevel"
                                value={form.classLevel}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Mode + Location */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <Select
                                items={{
                                    online: "Online",
                                    offline: "Offline",
                                }}
                                value={form.mode}
                                onValueChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        mode: String(value),
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-location">
                                Location {form.mode === "offline" && "*"}
                            </Label>
                            <Input
                                id="edit-location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                disabled={form.mode === "online"}
                            />
                        </div>
                    </div>

                    {/* Fee + Days per week */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-monthlyFee">Monthly Fee (৳) *</Label>
                            <Input
                                id="edit-monthlyFee"
                                name="monthlyFee"
                                type="number"
                                min={0}
                                value={form.monthlyFee}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-daysPerWeek">Days Per Week</Label>
                            <Input
                                id="edit-daysPerWeek"
                                name="daysPerWeek"
                                type="number"
                                min={0}
                                max={7}
                                value={form.daysPerWeek}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Banner image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-bannerImage">Banner Image URL</Label>
                        <Input
                            id="edit-bannerImage"
                            name="bannerImage"
                            placeholder="https://i.ibb.co/..."
                            value={form.bannerImage}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Active / Close toggle */}
                    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <Label htmlFor="edit-isActive">Active</Label>
                            <p className="text-xs text-muted-foreground">
                                Turn off to close this tuition (hidden from students).
                            </p>
                        </div>
                        <Switch
                            id="edit-isActive"
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setForm((prev) => ({ ...prev, isActive: checked }))
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// =============================================================
// DELETE dialog - confirmation only. Removes the row on success.
// =============================================================
export function DeleteTuitionDialog({
    tuition,
    onOpenChange,
    onDeleted,
}: {
    tuition: Tuition;
    onOpenChange: (open: boolean) => void;
    onDeleted: (deletedId: string) => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            await apiDelete(`/api/tuitions/${tuition._id}`);

            toast.success("Tuition deleted.");
            onDeleted(tuition._id); // page removes the row and closes the dialog
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete tuition."
            );
            setIsDeleting(false); // stay open so the tutor can retry
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this tuition?</AlertDialogTitle>
                    <AlertDialogDescription>
                        &quot;{tuition.title}&quot; will be permanently removed. This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
