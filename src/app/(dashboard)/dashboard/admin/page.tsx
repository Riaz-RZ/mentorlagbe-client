"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Clock,
    CreditCard,
    DollarSign,
    ShieldCheck,
    Users,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";

import { StatCard, ActionRow } from "@/components/dashboard/shared/OverviewCards";

// Shape returned by GET /api/users/stats.
interface AdminStats {
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    pendingTuitions: number;
    totalRevenue: number;
}

// =============================================================
// Admin overview ("System Administration"): platform metrics,
// tuition-moderation queue and payment volume.
// =============================================================
const AdminDashboardPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Better Auth types role as "student" | "tutor" — "admin" is set in the DB.
    const adminRole = session?.user?.role as string | undefined;

    // Load platform stats (admin only).
    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/login");
            return;
        }

        // Role mismatch -> back to their own dashboard.
        if (adminRole && adminRole !== "admin") {
            router.replace(`/dashboard/${adminRole}`);
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<AdminStats>("/api/users/stats");
                if (!cancelled) setStats(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load platform stats."
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
    }, [isPending, session, adminRole, router]);

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

    const pending = stats?.pendingTuitions ?? 0;

    return (
        <div className="space-y-5">
            {/* ================= Header ================= */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    System Administration
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Platform metrics, tuition-moderation queue, user roles, and
                    payment volume.
                </p>
            </div>

            {/* ================= Stat cards ================= */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading || !stats ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Total Users"
                            value={String(stats.totalUsers)}
                            note="Registered students and mentors"
                            icon={Users}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Total Tutors"
                            value={String(stats.totalTutors)}
                            note={`${stats.totalStudents} active students enrolled`}
                            icon={ShieldCheck}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                        <StatCard
                            label="Pending Tuitions"
                            value={String(pending)}
                            note={
                                pending === 0
                                    ? "No items require moderation"
                                    : "Awaiting moderation checks"
                            }
                            icon={Clock}
                            iconClass="bg-emerald-50 text-emerald-600"
                            pill={pending === 0 ? "All Clear" : `${pending} queued`}
                            pillClass={
                                pending === 0
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
                            }
                        />
                        <StatCard
                            label="Total Revenue"
                            value={`$${stats.totalRevenue}`}
                            note="Cumulative Stripe subscription volume"
                            icon={DollarSign}
                            iconClass="bg-emerald-50 text-emerald-600"
                        />
                    </>
                )}
            </div>

            {/* ================= Quick links ================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ActionRow
                    href="/dashboard/admin/users"
                    icon={Users}
                    iconClass="bg-blue-50 text-blue-600"
                    title="User Management"
                    subtitle="Manage roles & access"
                />
                <ActionRow
                    href="/dashboard/admin/tuitions"
                    icon={BookOpen}
                    iconClass="bg-amber-50 text-amber-600"
                    title="Tuition Moderation"
                    subtitle={
                        isLoading
                            ? "Loading queue..."
                            : pending === 0
                              ? "0 pending review"
                              : `${pending} pending review`
                    }
                />
                <ActionRow
                    href="/dashboard/admin/transactions"
                    icon={CreditCard}
                    iconClass="bg-emerald-50 text-emerald-600"
                    title="Transactions"
                    subtitle="Stripe payment logs"
                />
            </div>

            {/* ================= Extra: role summary banner ================= */}
            {!isLoading && stats && (
                <Link
                    href="/dashboard/admin/users"
                    className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:hover:bg-blue-950/70"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <BadgeCheck className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-blue-900 dark:text-blue-100">
                            {stats.totalTutors} tutors · {stats.totalStudents}{" "}
                            students on the platform
                        </span>
                        <span className="mt-0.5 block text-xs text-blue-700 dark:text-blue-300">
                            Review and change user roles from User Management.
                        </span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-blue-600" />
                </Link>
            )}
        </div>
    );
};

export default AdminDashboardPage;
