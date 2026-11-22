"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Bookmark,
    CalendarDays,
    MapPin,
    Monitor,
    UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";

// =============================================================
// One tuition card. Shared by the Browse Tuitions page and the
// Featured Tuitions section on the homepage.
// =============================================================
const TuitionCard = ({ tuition }: { tuition: Tuition }) => {
    const router = useRouter();

    // Bookmark is visual only for now (no backend yet).
    const [saved, setSaved] = useState(false);

    const hasImage = tuition.bannerImage.startsWith("http");

    return (
        <Card className="group gap-0 py-0">
            {/* Image + overlays */}
            <div className="p-3 pb-0">
                <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {hasImage ? (
                        <Image
                            src={tuition.bannerImage}
                            alt={tuition.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-slate-400">
                            <Monitor className="size-10" />
                        </div>
                    )}

                    {/* Mode badge (top-left) */}
                    {tuition.mode === "offline" ? (
                        <Badge className="absolute left-2 top-2 gap-1 border-0 bg-slate-900 text-white hover:bg-slate-900">
                            <MapPin className="size-3" />
                            {tuition.location || "Offline"}
                        </Badge>
                    ) : (
                        <Badge className="absolute left-2 top-2 gap-1 border-0 bg-emerald-600 text-white hover:bg-emerald-600">
                            <Monitor className="size-3" />
                            Online
                        </Badge>
                    )}

                    {/* Bookmark (top-right) */}
                    <button
                        type="button"
                        aria-label="Save tuition"
                        onClick={() => setSaved((prev) => !prev)}
                        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-colors hover:text-emerald-600 dark:bg-white dark:text-slate-700"
                    >
                        <Bookmark
                            className={`size-4 ${saved ? "fill-emerald-600 text-emerald-600" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Body */}
            <CardContent className="flex flex-1 flex-col gap-3">
                {/* Subject + class level */}
                <div className="flex items-center justify-between gap-2">
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                    >
                        {tuition.subject}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {tuition.classLevel}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className="line-clamp-1 font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-100"
                    title={tuition.title}
                >
                    {tuition.title}
                </h3>

                {/* Tutor + days per week */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <UserRound className="size-3.5" />
                        {tuition.tutorName || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {tuition.daysPerWeek}d/week
                    </span>
                </div>

                {/* Fee + View Details */}
                <div className="mt-auto flex items-end justify-between gap-2 border-t pt-3">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Monthly Fee
                        </p>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            ৳{tuition.monthlyFee}
                            <span className="text-xs font-normal text-slate-500">/mo</span>
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push(`/tuitions/${tuition._id}`)}
                        className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    >
                        View Details
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default TuitionCard;
