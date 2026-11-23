
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Mail,
    LockKeyhole,
    UserRound,
    BookOpen,
    GraduationCap,
    ArrowRight,
    ImagePlus,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/lib/auth-client";
import Image from "next/image";
import GoogleMark from "@/components/auth/GoogleMark";

type UserRole = "student" | "tutor";

export default function SignupForm() {
    const [role, setRole] = useState<UserRole>("student");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error("Please accept the Terms and Conditions.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Registration data for future Better Auth integration
            const { error } = await signUp.email({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                image: formData.image.trim() || undefined,
                role,
                callbackURL: "/login",
            });

            if (error) {
                toast.error(error.message || "Registration failed.");
                return;
            }

            toast.success("Account created successfully!");

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            )
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="surface-3d gap-1 border-slate-200/80 py-2 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:gap-2 lg:py-3">
            <CardHeader className="relative lg:px-8">
                <CardTitle className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                    Create your account
                </CardTitle>
                <Link
                    href="/"
                    className="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
                >
                    <ArrowLeft className="size-4" />
                    Back to Home
                </Link>
            </CardHeader>

            <CardContent className="pb-1 lg:px-8 lg:pb-2">
                <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-3">

                    {/* Role Selection */}
                    <div className="space-y-1 lg:space-y-2">
                        <Label>I want to join as a</Label>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                aria-pressed={role === "student"}
                                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${role === "student"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/50"
                                    : "border-slate-200 hover:border-blue-300 dark:border-slate-700"
                                    }`}
                            >
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${role === "student"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                        }`}
                                >
                                    <BookOpen className="size-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Student</p>
                                    <p className="text-xs text-muted-foreground">
                                        Find tutors
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("tutor")}
                                aria-pressed={role === "tutor"}
                                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${role === "tutor"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/50"
                                    : "border-slate-200 hover:border-blue-300 dark:border-slate-700"
                                    }`}
                            >
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${role === "tutor"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                        }`}
                                >
                                    <GraduationCap className="size-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Tutor</p>
                                    <p className="text-xs text-muted-foreground">
                                        Teach students
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-0 lg:space-y-1">
                        <Label htmlFor="name">Full Name</Label>

                        <div className="relative">
                            <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="h-9 pl-10 lg:h-10"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-0 lg:space-y-1">
                        <Label htmlFor="email">Email Address</Label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-9 pl-10 lg:h-10"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>
                    {/* Profile Image */}
                    <div className="space-y-0 lg:space-y-1">
                        <Label htmlFor="image">Profile Image URL (Optional)</Label>

                        <div className="relative">
                            <ImagePlus className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="image"
                                name="image"
                                type="url"
                                placeholder="https://example.com/profile.jpg"
                                value={formData.image}
                                onChange={handleChange}
                                className="h-9 pl-10 lg:h-10"
                            />
                        </div>

                        {formData.image && (
                            <div className="flex items-center gap-3">
                                <Image
                                    src={formData.image}
                                    width={50}
                                    height={50}
                                    alt="Profile preview"
                                    className="size-12 rounded-full border object-cover"
                                />
                                <span className="text-xs text-muted-foreground">
                                    Profile preview
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-0 lg:space-y-1">
                        <Label htmlFor="password">Password</Label>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                className="h-9 pl-10 pr-11 lg:h-10"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Use at least 8 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-0 lg:space-y-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="h-9 pl-10 pr-11 lg:h-10"
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2">
                        <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="mt-1 size-4 cursor-pointer accent-blue-600"
                        />

                        <Label
                            htmlFor="agreeToTerms"
                            className="cursor-pointer text-sm font-normal leading-5 text-muted-foreground"
                        >
                            I agree to the{" "}
                            <Link
                                href="/terms"
                                className="font-medium text-blue-600 hover:underline dark:text-sky-400"
                            >
                                Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="font-medium text-blue-600 hover:underline dark:text-sky-400"
                            >
                                Privacy Policy
                            </Link>.
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-9 w-full bg-blue-600 text-sm font-semibold tracking-wide text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 lg:h-10 lg:text-base"
                    >
                        {isSubmitting ? (
                            "Creating account..."
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="ml-2 size-4" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Divider */}
                <div className="my-2 flex items-center gap-4 lg:my-4">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                        OR CONTINUE WITH
                    </span>
                    <Separator className="flex-1" />
                </div>

                {/* Google Sign Up - UI only */}
                <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full font-semibold tracking-wide lg:h-10"
                    onClick={() =>
                        toast.info("Google sign-up will be available soon.")
                    }
                >
                    <GoogleMark />
                    Sign up with Google
                </Button>

                {/* Login Link */}
                <p className="mt-2 text-center text-sm text-muted-foreground lg:mt-4">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-blue-600 hover:underline dark:text-sky-400"
                    >
                        Sign In
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
