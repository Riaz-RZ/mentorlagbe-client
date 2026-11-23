"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Atom,
    Calculator,
    Code2,
    Languages,
    UsersRound,
} from "lucide-react";

import { apiGet } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type PublicUserCounts = {
    students: number;
    tutors: number;
};

const subjects = [
    {
        name: "Math",
        description: "Strengthen core concepts and problem-solving skills.",
        icon: Calculator,
    },
    {
        name: "Physics",
        description: "Make challenging ideas easier to understand.",
        icon: Atom,
    },
    {
        name: "Programming",
        description: "Learn coding fundamentals through guided practice.",
        icon: Code2,
    },
    {
        name: "IELTS",
        description: "Prepare across speaking, writing, listening, and reading.",
        icon: Languages,
    },
];

const formatCount = (value: number) => new Intl.NumberFormat().format(value);

const SubjectsAndStats = () => {
    const [counts, setCounts] = useState<PublicUserCounts | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadCounts = async () => {
            try {
                const data = await apiGet<PublicUserCounts>(
                    "/api/users/public-stats"
                );
                if (
                    !Number.isSafeInteger(data.students) ||
                    !Number.isSafeInteger(data.tutors) ||
                    data.students < 0 ||
                    data.tutors < 0
                ) {
                    throw new Error("The API returned invalid member totals.");
                }
                if (!cancelled) setCounts(data);
            } catch {
                if (!cancelled) setHasError(true);
            }
        };

        void loadCounts();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="mt-14 rounded-3xl border border-border bg-card px-5 py-10 shadow-sm sm:px-8 sm:py-12">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Subjects and community
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Find your next learning goal
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                    Explore popular subjects and see the student and tutor
                    community grow with live account totals.
                </p>
            </div>

            <div className="mt-9 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                        Popular subjects
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {subjects.map((subject) => {
                            const Icon = subject.icon;

                            return (
                                <article
                                    key={subject.name}
                                    className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {subject.name}
                                        </h4>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {subject.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <Link
                        href="/tuitions"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                        Browse all tuitions
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>

                <aside className="rounded-2xl bg-primary/10 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <UsersRound className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Our learning community
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Registered, non-banned accounts
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {[
                            { label: "Students", value: counts?.students },
                            { label: "Tutors", value: counts?.tutors },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-border bg-card p-4"
                            >
                                {stat.value !== undefined ? (
                                    <p className="text-2xl font-bold text-foreground">
                                        {formatCount(stat.value)}
                                    </p>
                                ) : hasError ? (
                                    <p className="text-2xl font-bold text-muted-foreground">
                                        —
                                    </p>
                                ) : (
                                    <Skeleton className="h-8 w-20" />
                                )}
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p
                        className="mt-4 text-xs leading-5 text-muted-foreground"
                        role={hasError ? "status" : undefined}
                    >
                        {hasError
                            ? "Live community totals are unavailable right now."
                            : "Counts update from current account totals."}
                    </p>
                </aside>
            </div>
        </section>
    );
};

export default SubjectsAndStats;
