
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    Mail,
    LockKeyhole,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password) {
            toast.error("Please enter your email and password.");
            return;
        }

        try {
            setIsSubmitting(true);

            const { error } = await authClient.signIn.email({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                rememberMe,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                return;
            }

            toast.success("Welcome back! Login successful.");

            // Give Sonner time to display the toast before navigation.
            await new Promise((resolve) => setTimeout(resolve, 800));

            router.replace("/");
            router.refresh();

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch {
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    return (
        <Card className="w-full border border-slate-200/80 bg-white shadow-xl shadow-blue-950/5 dark:border-slate-700 dark:bg-slate-900">
            <CardHeader className="space-y-2 pb-6 text-center">
                <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-sky-400">
                    <LockKeyhole className="size-7" />
                </div>

                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Welcome Back!
                </CardTitle>

                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                    Sign in to continue your MentorLagbe journey.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="h-12 pl-10 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>

                            <Link
                                href="/forgot-password"
                                className="text-xs font-semibold text-blue-600 hover:text-sky-600 dark:text-sky-400"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="h-12 pl-10 pr-12 focus-visible:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="rememberMe"
                            checked={rememberMe}
                            onCheckedChange={(checked) =>
                                setRememberMe(checked === true)
                            }
                        />

                        <Label
                            htmlFor="rememberMe"
                            className="cursor-pointer text-sm font-normal text-slate-600 dark:text-slate-400"
                        >
                            Remember me
                        </Label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 w-full bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="ml-2 size-4" />
                            </>
                        )}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                            OR CONTINUE WITH
                        </span>
                    </div>
                </div>

                {/* Google Login */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="h-12 w-full border-slate-200 font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                    <span className="mr-2 text-lg font-bold text-blue-600">
                        G
                    </span>
                    Continue with Google
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-blue-600 hover:text-sky-600 dark:text-sky-400"
                    >
                        Create an account
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
