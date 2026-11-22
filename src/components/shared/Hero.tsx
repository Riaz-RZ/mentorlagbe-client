"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowRight,
    GraduationCap,
    Search,
    Upload,
    Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

// =============================================================
// Static data for the Live Classes tab.
// =============================================================
const liveSessions = [
    {
        title: "Physics: Advanced Mechanics",
        tutor: "Dr. Ayesha Rahman",
        date: "Tomorrow, 8:00 PM",
        duration: "60 min",
        students: 18,
        status: "Upcoming",
    },
    {
        title: "IELTS Speaking Practice",
        tutor: "Mr. Imran Kabir",
        date: "Fri, 6:00 PM",
        duration: "45 min",
        students: 12,
        status: "Upcoming",
    },
];

// =============================================================
// Hero section: heading + 3 tabs (Find Tuition / Become a Tutor /
// Live Classes). Used on the homepage.
// =============================================================
const Hero = () => {
    // Which tab is open: "find" | "tutor" | "live"
    const [tab, setTab] = useState("find");

    // Search box (visual only for now)
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        if (!search.trim()) {
            toast.info("Type something to search.");
            return;
        }
        toast.info("Search opens the tuition list in a later phase.");
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50/70 to-white px-5 py-10 dark:border-slate-800 dark:from-slate-950 dark:to-slate-950 sm:px-8 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-3xl text-center">
                <Badge
                    variant="outline"
                    className="mb-4 gap-1.5 border-blue-200 bg-white px-3 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-300"
                >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Trusted Tuition Marketplace
                </Badge>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                    Find a Perfect Tuition
                    <br />
                    or Start Teaching Today
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                    Discover tuition jobs, teach subjects you love, and
                    connect with students in your area — all in one platform.
                </p>
            </div>

            {/* ---------------- Tabs ---------------- */}
            <Tabs
                value={tab}
                onValueChange={(v) => setTab(String(v))}
                className="mx-auto mt-8 max-w-3xl"
            >
                <TabsList className="mx-auto flex h-auto w-full flex-row gap-1 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    <TabsTrigger
                        value="find"
                        className="flex-1 gap-2 rounded-lg px-3 py-2.5 data-active:bg-primary data-active:text-primary-foreground"
                    >
                        <Search className="size-4" />
                        Find Tuition
                    </TabsTrigger>
                    <TabsTrigger
                        value="tutor"
                        className="flex-1 gap-2 rounded-lg px-3 py-2.5 data-active:bg-primary data-active:text-primary-foreground"
                    >
                        <GraduationCap className="size-4" />
                        Become a Tutor
                    </TabsTrigger>
                    <TabsTrigger
                        value="live"
                        className="flex-1 gap-2 rounded-lg px-3 py-2.5 data-active:bg-primary data-active:text-primary-foreground"
                    >
                        <Video className="size-4" />
                        Live Classes
                    </TabsTrigger>
                </TabsList>

                {/* ============ Tab 1: Find Tuition ============ */}
                <TabsContent value="find" className="mt-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    className="pl-9"
                                    placeholder="Search tuition subject, class level, or location..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Input placeholder="Category" />
                            <Input placeholder="Class Level" />
                            <Input placeholder="Location" />
                        </div>

                        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <Link
                                href="/tuitions"
                                className="text-sm font-medium text-blue-600 hover:underline dark:text-sky-400"
                            >
                                Browse All Tuitions
                            </Link>

                            <Button
                                className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
                                onClick={handleSearch}
                            >
                                <Search className="size-4" />
                                Search
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ============ Tab 2: Become a Tutor ============ */}
                <TabsContent value="tutor" className="mt-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-5">
                        <p className="mb-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                            Create Your Tuition Post in 4 Easy Steps
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Step 1 */}
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Photo upload opens in a later phase."
                                    )
                                }
                                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 px-4 py-5 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400"
                            >
                                <Upload className="size-5" />
                                <span className="text-sm font-medium">
                                    Upload Profile Photo
                                </span>
                                <span className="text-xs">
                                    JPEG, PNG, max 5MB
                                </span>
                            </button>

                            {/* Step 2 */}
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Banner upload opens in a later phase."
                                    )
                                }
                                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 px-4 py-5 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400"
                            >
                                <Upload className="size-5" />
                                <span className="text-sm font-medium">
                                    Upload Banner Image
                                </span>
                                <span className="text-xs">
                                    JPEG, PNG, max 10MB
                                </span>
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button
                                variant="outline"
                                className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                onClick={() =>
                                    toast.info(
                                        "Subject picker opens in a later phase."
                                    )
                                }
                            >
                                Add Subject &amp; Class Level
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                onClick={() =>
                                    toast.info(
                                        "Fee input opens in a later phase."
                                    )
                                }
                            >
                                Add Expected Monthly Fee
                            </Button>
                        </div>

                        <Button
                            className="mt-4 w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() =>
                                toast.info(
                                    "Post submission opens in a later phase."
                                )
                            }
                        >
                            Upload Post
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </TabsContent>

                {/* ============ Tab 3: Live Classes ============ */}
                <TabsContent value="live" className="mt-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Upcoming Sessions
                            </h2>
                            <Badge
                                variant="outline"
                                className="gap-1.5 border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300"
                            >
                                <span className="size-1.5 animate-pulse rounded-full bg-purple-500" />
                                2 Live Now
                            </Badge>
                        </div>

                        <div className="mt-4 space-y-3">
                            {liveSessions.map((session) => (
                                <div
                                    key={session.title}
                                    className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {session.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {session.tutor} · {session.date} ·{" "}
                                            {session.duration} ·{" "}
                                            {session.students} students
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                        >
                                            {session.status}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            className="gap-1.5 bg-purple-600 text-white hover:bg-purple-700"
                                            onClick={() =>
                                                toast.info(
                                                    "Class link opens in a later phase."
                                                )
                                            }
                                        >
                                            <Video className="size-3.5" />
                                            Join Class
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                            Live class links are shared after your tuition
                            application is accepted.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default Hero;
