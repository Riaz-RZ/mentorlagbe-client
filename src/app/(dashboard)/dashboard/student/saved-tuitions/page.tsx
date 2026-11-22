"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bookmark, RefreshCw, Search } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import TuitionCard from "@/components/shared/TuitionCard";
import { useSavedTuitions } from "@/components/providers/SavedTuitionsProvider";
import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";

// =============================================================
// Saved Tuitions: every tuition the student bookmarked from the
// marketplace (TuitionCard bookmark button).
// =============================================================
const SavedTuitionsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const { savedIds, loaded } = useSavedTuitions();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(0);

    const email = session?.user?.email;
    // Better Auth types role as "student" | "tutor" (admin lives in the DB).
    const role = session?.user?.role as string | undefined;

    useEffect(() => {
        if (isPending) return;

        if (!email) {
            router.replace("/login");
            return;
        }

        // Only students have saved tuitions.
        if (role && role !== "student") {
            router.replace(`/dashboard/${role}`);
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Tuition[]>(
                    `/api/saved?studentEmail=${encodeURIComponent(email)}`
                );
                if (!cancelled) setTuitions(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load saved tuitions."
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
    }, [isPending, email, role, router, reload]);

    // Session still loading (or signed out - the effect redirects).
    if (isPending || !session) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    // Drop a card as soon as its bookmark is removed (shared context).
    const visible = loaded
        ? tuitions.filter((t) => savedIds.includes(t._id))
        : tuitions;

    return (
        <div className="space-y-5">
            {/* ================= Header ================= */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Saved Tuitions
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Tuitions you bookmarked from the marketplace.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setIsLoading(true);
                        setReload((n) => n + 1);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <RefreshCw className="size-4" />
                    Refresh
                </button>
            </div>

            {/* ================= Content ================= */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-xl" />
                    ))}
                </div>
            ) : visible.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                    <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                        <Bookmark className="size-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No saved tuitions yet
                    </h2>
                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                        Tap the bookmark icon on any tuition card to save it
                        here for later.
                    </p>
                    <Link
                        href="/tuitions"
                        className={buttonVariants({
                            className:
                                "mt-5 gap-2 bg-emerald-600 text-white hover:bg-emerald-700",
                        })}
                    >
                        <Search className="size-4" />
                        Browse Tuitions
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((tuition) => (
                        <TuitionCard key={tuition._id} tuition={tuition} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedTuitionsPage;
