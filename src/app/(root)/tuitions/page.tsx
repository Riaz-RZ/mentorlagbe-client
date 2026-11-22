"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { RotateCcw, Search } from "lucide-react";

import { apiGet } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";
import TuitionCard from "@/components/shared/TuitionCard";

const TuitionsPage = () => {
    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters - all handled in the browser (the list is small).
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("all");
    const [level, setLevel] = useState("all");
    const [mode, setMode] = useState("all");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                // Backend returns only approved + active tuitions.
                const data = await apiGet<Tuition[]>("/api/tuitions");
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

    // Unique values for the dropdowns (built from the loaded list).
    const subjects = Array.from(new Set(tuitions.map((t) => t.subject)));
    const levels = Array.from(new Set(tuitions.map((t) => t.classLevel)));

    // Small helper: "value" -> label map for the Select component.
    const toItems = (label: string, values: string[]) =>
        Object.fromEntries([["all", label], ...values.map((v) => [v, v])]);

    // Apply all three filters + the search box.
    const filtered = tuitions.filter((tuition) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
            !q ||
            [tuition.title, tuition.subject, tuition.tutorName, tuition.description]
                .join(" ")
                .toLowerCase()
                .includes(q);

        return (
            matchesSearch &&
            (subject === "all" || tuition.subject === subject) &&
            (level === "all" || tuition.classLevel === level) &&
            (mode === "all" || tuition.mode === mode)
        );
    });

    // Search button (form submit so Enter works too).
    const handleSearch = (e: FormEvent) => {
        e.preventDefault(); // prevents a page reload
    };

    // Reset = clear every filter back to "all".
    const resetFilters = () => {
        setSearch("");
        setSubject("all");
        setLevel("all");
        setMode("all");
    };

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {/* ---------- Heading ---------- */}
            <div className="mb-8 space-y-3 text-center">
                <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] tracking-wider text-emerald-700 uppercase dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                >
                    Tuition Marketplace
                </Badge>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Browse All Tuitions
                </h1>
                <p className="mx-auto max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    Explore vetted tuition posts and mentorship batches. Filter by
                    academic subject, grade level, and online or in-person delivery.
                </p>
            </div>

            {/* ---------- Filter bar ---------- */}
            <Card className="mb-8">
                <CardContent>
                    {/* Search row */}
                    <form onSubmit={handleSearch} className="mb-5 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                className="pl-9"
                                placeholder="Search tuitions by title, tutor, or keyword..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <Search className="size-4" />
                            Search
                        </Button>
                    </form>

                    {/* Dropdown row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Select
                                items={toItems("All Subjects", subjects)}
                                value={subject}
                                onValueChange={(v) => setSubject(String(v))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {subjects.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Class Level</Label>
                            <Select
                                items={toItems("All Levels", levels)}
                                value={level}
                                onValueChange={(v) => setLevel(String(v))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {levels.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Mode</Label>
                            <Select
                                items={{ all: "All Modes", online: "Online", offline: "Offline" }}
                                value={mode}
                                onValueChange={(v) => setMode(String(v))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modes</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset sits on the same line as the selects */}
                        <div className="flex items-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="size-4" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ---------- Result count ---------- */}
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {tuitions.length}
                </span>{" "}
                tuitions
            </p>

            {/* ---------- Cards ---------- */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-16/10 w-full rounded-xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                    No tuitions match your filters.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((tuition) => (
                        <TuitionCard key={tuition._id} tuition={tuition} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default TuitionsPage;
