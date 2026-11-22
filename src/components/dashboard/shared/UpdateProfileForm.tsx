"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, KeyRound, Loader2, Save } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { uploadToIMGBB } from "@/lib/imgbb";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Generate initials for the avatar fallback.
const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

// The logged-in user's fields we need (from the Better Auth session).
type SessionUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

// =============================================================
// Update Profile form, shared by the student and tutor profile
// pages. Name + picture go to Better Auth's /api/auth/update-user,
// the password to /api/auth/change-password (decision D1).
// =============================================================
const UpdateProfileForm = () => {
    const { data: session, isPending } = authClient.useSession();

    // Session still loading (or signed out).
    if (isPending || !session) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-72 w-full rounded-xl" />
            </div>
        );
    }

    // key = user id, so the form fills itself from the session once,
    // and never remounts while the user is typing.
    return <ProfileForm key={session.user.id} user={session.user} />;
};

// -------------------------------------------------------------
// The actual form (state starts from the session user).
// -------------------------------------------------------------
function ProfileForm({ user }: { user: SessionUser }) {
    const router = useRouter();

    // Profile card
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState(user.image || ""); // IMGBB URL
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password card
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);

    // Pick a photo -> upload to IMGBB -> keep the URL for "Save Changes".
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadToIMGBB(file);
            setImage(url);
            toast.success("Photo uploaded. Click Save Changes to apply it.");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Upload failed."
            );
        } finally {
            setIsUploading(false);
            e.target.value = ""; // allow picking the same file again
        }
    };

    // Save name + picture to Better Auth.
    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required.");
            return;
        }

        setIsSavingProfile(true);
        const { error } = await authClient.updateUser({
            name: name.trim(),
            image: image || null,
        });
        setIsSavingProfile(false);

        if (error) {
            toast.error(error.message || "Failed to update profile.");
            return;
        }

        toast.success("Profile updated.");
        router.refresh(); // Navbar picks up the new name/photo
    };

    // Change password through Better Auth (it verifies the old one).
    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setIsSavingPassword(true);
        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
        });
        setIsSavingPassword(false);

        if (error) {
            toast.error(error.message || "Failed to change password.");
            return;
        }

        toast.success("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="space-y-4">
            {/* ================= Profile card ================= */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your name and profile photo.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        {/* Avatar + upload button */}
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16">
                                <AvatarImage src={image} alt={name} />
                                <AvatarFallback className="bg-blue-100 text-base font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    {getInitials(name) || "?"}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUploading}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {isUploading ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Camera className="size-4" />
                                    )}
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload Photo"}
                                </Button>
                                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    JPG or PNG, max 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="profile-name">Full Name</Label>
                            <Input
                                id="profile-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSavingProfile || isUploading}
                            >
                                {isSavingProfile ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* ================= Password card ================= */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Use at least 8 characters. You must know your current
                        password.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleChangePassword}
                        className="max-w-md space-y-4"
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="current-password">
                                Current Password
                            </Label>
                            <Input
                                id="current-password"
                                type="password"
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="confirm-password">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSavingPassword}>
                                {isSavingPassword ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <KeyRound className="size-4" />
                                )}
                                Change Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default UpdateProfileForm;
