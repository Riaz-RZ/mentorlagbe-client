"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, Monitor } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiPost } from "@/lib/actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// The four PRO perks shown on the MentorLagbe PRO card.
const proFeatures = [
    "Unlimited tuition posts & bookmarks",
    "Golden PRO verification badge",
    "Priority listing in search & category filters",
    "Priority applicant notifications & reviews",
];

// =============================================================
// "Choose Your Plan" pricing section on the homepage, right
// after Featured Tuitions. Free vs Pro (Stripe comes later).
// =============================================================
const PlanSection = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Better Auth types role as "student" | "tutor" (admin lives in the DB).
    const role = session?.user?.role as string | undefined;
    // "free" | "pro" - set by the Stripe verify endpoint (default free).
    const plan = (session?.user as { plan?: string } | undefined)?.plan;

    // Not logged in -> sign up page. Logged in -> own dashboard.
    const handleGetStarted = () => {
        if (!session) {
            router.push("/signup");
            return;
        }
        router.push(role ? `/dashboard/${role}` : "/dashboard");
    };

    // Only a logged-in student / tutor can upgrade to Pro.
    const handleUpgrade = async () => {
        if (!session) {
            toast.error("Please log in to upgrade to Pro");
            router.push("/login");
            return;
        }

        if (role !== "student" && role !== "tutor") {
            toast.error("Only students and tutors can upgrade to Pro");
            return;
        }

        if (plan === "pro") {
            toast.info("You already have the MentorLagbe PRO plan.");
            return;
        }

        // Create a Stripe Checkout session and go to its hosted page.
        try {
            setIsRedirecting(true);
            const { url } = await apiPost<{ url: string }>(
                "/api/payments/checkout",
                {
                    userEmail: session.user.email,
                    userRole: role,
                }
            );
            window.location.href = url;
        } catch (error) {
            setIsRedirecting(false);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not start checkout."
            );
        }
    };

    return (
        <section className="mt-14 rounded-2xl bg-slate-50 px-4 py-12 dark:bg-slate-900/50 sm:px-6 lg:px-8">
            {/* ---------- Heading ---------- */}
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                    Choose Your Plan
                </h2>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                    Simple, transparent plans designed for committed students
                    and ambitious academic tutors.
                </p>
            </div>

            {/* ---------- Cards ---------- */}
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                {/* ============ Starter (free) ============ */}
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Starter Plan
                        </h3>
                        <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            Free Forever
                        </Badge>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Perfect for students and tutors looking to test the
                        platform.
                    </p>

                    <p className="mt-4">
                        <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                            $0
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {" "}
                            /month
                        </span>
                    </p>

                    {/* Dashboard preview placeholder */}
                    <div className="mt-4 flex aspect-16/10 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60">
                        <Monitor className="size-10 text-slate-400" />
                        <div className="w-2/3 space-y-1.5">
                            <div className="h-2 w-full rounded bg-slate-300 dark:bg-slate-700" />
                            <div className="h-2 w-5/6 rounded bg-slate-300 dark:bg-slate-700" />
                            <div className="h-2 w-2/3 rounded bg-slate-300 dark:bg-slate-700" />
                        </div>
                    </div>

                    <Button
                        onClick={handleGetStarted}
                        className="mt-5 w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                        Get Started Free
                    </Button>
                </div>

                {/* ============ MentorLagbe PRO ============ */}
                <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-white p-6 dark:border-emerald-600 dark:bg-slate-900">
                    {/* Recommended ribbon */}
                    <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm">
                        ★ RECOMMENDED
                    </span>

                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            MentorLagbe PRO
                        </h3>
                        <Badge className="border-0 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">
                            PRO Badge
                        </Badge>
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Unlimited reach, verified credential badges, and
                        priority matching.
                    </p>

                    <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-500">
                            $15
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            /mo for Tutors
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            or
                        </span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                            $10
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            /mo for Students
                        </span>
                    </div>

                    {/* PRO perks */}
                    <ul className="mt-5 space-y-3">
                        {proFeatures.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                            >
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                    <Check className="size-3" />
                                </span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Button
                        onClick={handleUpgrade}
                        disabled={isRedirecting}
                        className="mt-6 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        {isRedirecting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Redirecting to Stripe...
                            </>
                        ) : plan === "pro" ? (
                            "You're on Pro ✓"
                        ) : (
                            <>
                                Upgrade to Pro
                                <ArrowRight className="size-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default PlanSection;
