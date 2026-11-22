"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeft,
    Bookmark,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    Monitor,
    Share2,
    Star,
    UserRound,
} from "lucide-react";

import { apiGet } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";

const TuitionDetailsPage = () => {
    // The id comes from the URL: /tuitions/<id>
    const { id } = useParams<{ id: string }>();

    const [tuition, setTuition] = useState<Tuition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saved, setSaved] = useState(false); // bookmark (visual only)

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Tuition>(`/api/tuitions/${id}`);
                if (!cancelled) setTuition(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load tuition."
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
    }, [id]);

    // Loading skeleton
    if (isLoading) {
        return (
            <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 lg:px-8">
                <Skeleton className="h-6 w-44" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </main>
        );
    }

    // Tuition not found (bad id, or not approved / not active)
    if (!tuition) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    This tuition is not available.
                </p>
                <Link
                    href="/tuitions"
                    className="mt-4 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                    Back to All Tuitions
                </Link>
            </main>
        );
    }

    // "Nov 9, 2026"
    const postedOn = new Date(tuition.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            {/* Back link */}
            <Link
                href="/tuitions"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
                <ArrowLeft className="size-4" />
                Back to All Tuitions
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* ================= LEFT (2 cols) ================= */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Banner image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        {tuition.bannerImage.startsWith("http") ? (
                            <Image
                                src={tuition.bannerImage}
                                alt={tuition.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 66vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center text-slate-400">
                                <Monitor className="size-12" />
                            </div>
                        )}

                        {/* Session badge (top-left) */}
                        <Badge className="absolute left-3 top-3 gap-1 border-0 bg-slate-900 text-white hover:bg-slate-900">
                            <Monitor className="size-3" />
                            {tuition.mode === "offline" ? "Offline Session" : "Online Session"}
                        </Badge>

                        {/* Share + bookmark (top-right) */}
                        <div className="absolute right-3 top-3 flex gap-2">
                            <button
                                type="button"
                                aria-label="Share"
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(window.location.href)
                                        .then(() => toast.success("Link copied!"))
                                        .catch(() => toast.error("Could not copy link."));
                                }}
                                className="flex size-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:text-emerald-600"
                            >
                                <Share2 className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Save"
                                onClick={() => setSaved((prev) => !prev)}
                                className="flex size-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:text-emerald-600"
                            >
                                <Bookmark
                                    className={`size-4 ${saved ? "fill-emerald-600 text-emerald-600" : ""}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Title block */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                                {tuition.subject}
                            </Badge>
                            <Badge variant="outline">{tuition.classLevel}</Badge>
                            <Badge
                                variant="outline"
                                className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                                <CheckCircle2 className="size-3" />
                                Verified Tuition
                            </Badge>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 lg:text-3xl">
                            {tuition.title}
                        </h1>

                        {/* Mentor / schedule / posted */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <UserRound className="size-4" />
                                Mentor:{" "}
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {tuition.tutorName || "Unknown"}
                                </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="size-4" />
                                Schedule:{" "}
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {tuition.daysPerWeek} days / week
                                </span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-4" />
                                Posted:{" "}
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {postedOn}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* About This Tuition */}
                    <Card>
                        <CardContent className="space-y-3">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                About This Tuition
                            </h2>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                {tuition.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Student Reviews & Feedback */}
                    <Card>
                        <CardContent className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        Student Reviews &amp; Feedback
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Real experiences from accepted tuition attendees.
                                    </p>
                                </div>

                                {/* Rating summary (no reviews yet) */}
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        0.0
                                    </p>
                                    <div className="flex justify-end gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className="size-4 text-slate-300 dark:text-slate-600"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        0 reviews
                                    </p>
                                </div>
                            </div>

                            <p className="border-t pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                No reviews yet. Accepted students will be able to share
                                feedback after their classes.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* ================= RIGHT (sidebar) ================= */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 space-y-5">
                        <CardContent>
                            {/* Fee */}
                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                Monthly Tuition Fee
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
                                ৳{tuition.monthlyFee}
                                <span className="text-sm font-normal text-slate-500">
                                    {" "}
                                    /month
                                </span>
                            </p>

                            {/* Details rows */}
                            <dl className="mt-5 space-y-3 border-t pt-4 text-sm">
                                <Row label="Subject" value={tuition.subject} />
                                <Row label="Class Level" value={tuition.classLevel} />
                                <Row
                                    label="Delivery Mode"
                                    value={
                                        <span className="capitalize text-emerald-600">
                                            {tuition.mode}
                                        </span>
                                    }
                                />
                                <Row
                                    label="Location"
                                    value={
                                        tuition.mode === "offline" && tuition.location ? (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3.5" />
                                                {tuition.location}
                                            </span>
                                        ) : (
                                            "Online"
                                        )
                                    }
                                />
                                <Row
                                    label="Weekly Classes"
                                    value={
                                        <span className="font-semibold">
                                            {tuition.daysPerWeek} days / week
                                        </span>
                                    }
                                />
                                <Row
                                    label="Status"
                                    value={
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                        >
                                            Approved
                                        </Badge>
                                    }
                                />
                            </dl>

                            {/* Mentor */}
                            <div className="mt-5 border-t pt-4">
                                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Tuition Mentor
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 font-semibold text-white">
                                        {(tuition.tutorName || "?").charAt(0).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {tuition.tutorName || "Unknown"}
                                        </p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {tuition.tutorEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Apply (Phase 3 - applications not built yet) */}
                            <Button
                                className="mt-5 w-full bg-emerald-700 text-white hover:bg-emerald-800"
                                onClick={() =>
                                    toast.info("Applications open in a later phase.")
                                }
                            >
                                Apply Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
};

// One label/value row in the sidebar.
function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
                {value}
            </dd>
        </div>
    );
}

export default TuitionDetailsPage;
