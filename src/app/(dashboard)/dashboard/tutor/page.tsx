"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock,
    Crown,
    FilePlus2,
    FileText,
    TrendingUp,
    Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
    StatCard,
    ActionRow,
} from "@/components/dashboard/shared/OverviewCards";

// Only the fields this page needs.
interface TuitionPost {
    _id: string;
    approvalStatus: string; // pending | approved | rejected
}

interface Applicant {
    _id: string;
}

// =============================================================
// Tutor dashboard overview: welcome header, a "waiting for
// approval" alert, 4 stats, quick actions and the boost banner.
// =============================================================
const TutorDashboardPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [posts, setPosts] = useState<TuitionPost[]>([]);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const tutorEmail = session?.user?.email;
    const tutorName = session?.user?.name || "Tutor";

    // Load my tuition posts AND the applications I received (in parallel).
    useEffect(() => {
        if (isPending) return;

        if (!tutorEmail) {
            router.replace("/login");
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const [myPosts, myApplicants] = await Promise.all([
                    apiGet<TuitionPost[]>(
                        `/api/tuitions/mine?tutorEmail=${encodeURIComponent(tutorEmail)}`
                    ),
                    apiGet<Applicant[]>(
                        `/api/applications/tutor?tutorEmail=${encodeURIComponent(tutorEmail)}`
                    ),
                ]);

                if (!cancelled) {
                    setPosts(myPosts);
                    setApplicants(myApplicants);
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load your dashboard."
                    );
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [isPending, tutorEmail, router]);

    // Session still loading (or signed out - the effect redirects).
    if (isPending || !session) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    // Stats computed from my own posts + applicants.
    const totalPosts = posts.length;
    const approved = posts.filter(
        (post) => post.approvalStatus === "approved"
    ).length;
    const pendingReview = posts.filter(
        (post) => post.approvalStatus === "pending"
    ).length;
    const rate = totalPosts === 0 ? 0 : Math.round((approved / totalPosts) * 100);
    const totalApplicants = applicants.length;

    return (
        <div className="space-y-5">
            {/* ================= Welcome header ================= */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Welcome back, {tutorName}! 👋
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage your tuition posts, review applicants, and grow
                        your teaching journey.
                    </p>
                </div>

                <Link
                    href="/dashboard/tutor/post-tuition"
                    className={buttonVariants({
                        className:
                            "gap-2 bg-emerald-600 text-white hover:bg-emerald-700",
                    })}
                >
                    <FilePlus2 className="size-4" />
                    Post a Tuition
                </Link>
            </div>

            {/* ============ Waiting-for-approval alert ============ */}
            {!isLoading && pendingReview > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                        <Clock className="size-4" />
                    </span>
                    <p className="min-w-0 flex-1 text-sm text-amber-900 dark:text-amber-100">
                        <span className="font-semibold">
                            {pendingReview} tuition post
                            {pendingReview === 1 ? " is" : "s are"} awaiting
                            admin approval.
                        </span>{" "}
                        Approved posts appear on the public marketplace.
                    </p>
                    <Link
                        href="/dashboard/tutor/my-tuitions"
                        className="text-sm font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-300"
                    >
                        View My Tuitions →
                    </Link>
                </div>
            )}

            {/* ================= Stat cards ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Total Posts"
                            value={String(totalPosts)}
                            note="Tuition posts you have created"
                            icon={FileText}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Approved"
                            value={String(approved)}
                            note="Live on the public marketplace"
                            icon={CheckCircle2}
                            iconClass="bg-emerald-50 text-emerald-600"
                            pill={`${rate}% rate`}
                        />
                        <StatCard
                            label="Applicants"
                            value={String(totalApplicants)}
                            note="Students who applied to your posts"
                            icon={Users}
                            iconClass="bg-blue-50 text-blue-600"
                        />
                        {/* TODO(Phase 5): read users.plan once Stripe exists. */}
                        <StatCard
                            label="Current Plan"
                            value="FREE"
                            note="Upgrade to Pro for priority perks"
                            icon={Crown}
                            iconClass="bg-amber-50 text-amber-500"
                        />
                    </>
                )}
            </div>

            {/* ================= Quick Actions ================= */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Quick Actions
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <ActionRow
                        href="/dashboard/tutor/post-tuition"
                        icon={FilePlus2}
                        iconClass="bg-emerald-50 text-emerald-600"
                        title="Post a Tuition"
                        subtitle="Create a new tuition listing"
                    />
                    <ActionRow
                        href="/dashboard/tutor/my-tuitions"
                        icon={BookOpen}
                        iconClass="bg-blue-50 text-blue-600"
                        title="My Tuitions"
                        subtitle="Edit, close or delete your posts"
                    />
                    <ActionRow
                        href="/dashboard/tutor/applicants"
                        icon={Users}
                        iconClass="bg-amber-50 text-amber-600"
                        title="Manage Applicants"
                        subtitle="Accept or reject student applications"
                    />
                </CardContent>
            </Card>

            {/* ================= Boost banner ================= */}
            <Link
                href="/dashboard/tutor/profile"
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition-colors hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:hover:bg-emerald-950/70"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <TrendingUp className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        Boost your success rate
                    </span>
                    <span className="mt-0.5 block text-xs text-emerald-700 dark:text-emerald-300">
                        Keep your tutor profile and banner image up-to-date so
                        more students apply to your posts.
                    </span>
                </span>
                <ArrowRight className="mt-1 size-4 shrink-0 text-emerald-600" />
            </Link>
        </div>
    );
};

export default TutorDashboardPage;
