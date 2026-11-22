"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { apiGet } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";
import TuitionCard from "@/components/shared/TuitionCard";

// =============================================================
// Featured Tuitions: the 6 newest approved tuitions, shown on
// the homepage right after the trust strip.
// =============================================================
const FeaturedTuitions = () => {
    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Tuition[]>("/api/tuitions/latest");
                if (!cancelled) setTuitions(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load tuitions."
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
    }, []);

    return (
        <section className="mt-10">
            {/* ---------- Heading ---------- */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] tracking-wider text-emerald-700 uppercase dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                        Featured Tuitions
                    </Badge>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Latest Approved Tuitions
                    </h2>

                    <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
                        Discover top-rated home and online tuition
                        opportunities verified by academic administrators.
                    </p>
                </div>

                <Link
                    href="/tuitions"
                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                >
                    Browse All Tuitions
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            {/* ---------- Cards ---------- */}
            {isLoading ? (
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-16/10 w-full rounded-xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : tuitions.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No approved tuitions yet. Check back soon!
                </p>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tuitions.map((tuition) => (
                        <TuitionCard key={tuition._id} tuition={tuition} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedTuitions;
