"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowRight,
    Bookmark,
    CheckCircle2,
    Clock,
    Crown,
    FileText,
    GraduationCap,
    Search,
    TrendingUp,
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
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";

// One application document (same shape as My Applications).
interface Application {
    _id: string;
    status: string; // pending | accepted | rejected
}

// =============================================================
// Student dashboard overview: welcome header, 4 stats, quick
// actions and the "boost your success rate" banner.
// =============================================================
const StudentDashboardPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const studentEmail = session?.user?.email;
    const studentName = session?.user?.name || "Student";
    // "free" | "pro" - set by the Stripe verify endpoint.
    const plan =
        (session?.user as { plan?: string } | undefined)?.plan ?? "free";

    useEffect(() => {
        if (isPending) return;

        if (!studentEmail) {
            router.replace("/login");
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Application[]>(
                    `/api/applications/mine?studentEmail=${encodeURIComponent(studentEmail)}`
                );
                if (!cancelled) setApplications(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load your stats."
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
    }, [isPending, studentEmail, router]);

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

    // Stats computed from the student's own applications.
    const total = applications.length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const rate = total === 0 ? 0 : Math.round((accepted / total) * 100);

    return (
        <div className="space-y-5">
            {/* ================= Welcome header ================= */}
            <DashboardPageHeader
                eyebrow="STUDENT DASHBOARD"
                title={`Welcome back, ${studentName}!`}
                description="Track your tuition applications, reviews, and learning journey."
                icon={GraduationCap}
                action={
                    <Link
                        href="/tuitions"
                        className={buttonVariants({
                            className:
                                "gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-700",
                        })}
                    >
                        <Search className="size-4" />
                        Browse Tuitions
                    </Link>
                }
            />

            {/* ================= Stat cards ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Total Applied"
                            value={String(total)}
                            note="Total tuition posts applied for"
                            icon={FileText}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Accepted"
                            value={String(accepted)}
                            note="Approved applications by tutors"
                            icon={CheckCircle2}
                            iconClass="bg-emerald-50 text-emerald-600"
                            pill={`${rate}% rate`}
                        />
                        <StatCard
                            label="Pending"
                            value={String(pending)}
                            note="Awaiting tutor review and confirmation"
                            icon={Clock}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Current Plan"
                            value={plan === "pro" ? "PRO" : "FREE"}
                            note={
                                plan === "pro"
                                    ? "You are on the Pro plan"
                                    : "Upgrade to Pro for priority perks"
                            }
                            icon={Crown}
                            iconClass="bg-amber-50 text-amber-500"
                        />
                    </>
                )}
            </div>

            {/* ================= Quick Actions ================= */}
            <Card className="border-primary/15 bg-linear-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Quick Actions
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <ActionRow
                        href="/dashboard/student/my-applications"
                        icon={FileText}
                        iconClass="bg-emerald-50 text-emerald-600"
                        title="My Applications"
                        subtitle="Track and manage submissions"
                    />

                    {/* Saved Tuitions page exists now. */}
                    <ActionRow
                        href="/dashboard/student/saved-tuitions"
                        icon={Bookmark}
                        iconClass="bg-amber-50 text-amber-600"
                        title="Saved Tuitions"
                        subtitle="Your bookmarked subjects"
                    />

                    <ActionRow
                        href="/tuitions"
                        icon={Search}
                        iconClass="bg-blue-50 text-blue-600"
                        title="Explore Mentors"
                        subtitle="Find experienced tutors"
                    />
                </CardContent>
            </Card>

            {/* ================= Boost banner ================= */}
            <Link
                href="/dashboard/student/profile"
                className="flex items-start gap-3 rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 via-card to-card p-4 shadow-md shadow-primary/5 transition-shadow duration-300 hover:shadow-xl"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <TrendingUp className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        Boost your success rate
                    </span>
                    <span className="mt-0.5 block text-xs text-emerald-700 dark:text-emerald-300">
                        Keep your student profile and contact details up-to-date
                        so mentors can contact you quickly.
                    </span>
                </span>
                <ArrowRight className="mt-1 size-4 shrink-0 text-emerald-600" />
            </Link>
        </div>
    );
};

export default StudentDashboardPage;
