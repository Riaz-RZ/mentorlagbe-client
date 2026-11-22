"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        if (!search.trim()) {
            toast.info("Type something to search.");
            return;
        }
        toast.info("Search opens the tuition list in a later phase.");
    };

    return (
        <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card via-card to-primary/10 px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-primary/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full bg-secondary/60 blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12">
                <div>
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-border bg-card/80 px-3 py-1 text-[11px] font-medium text-foreground"
                    >
                        <span className="size-1.5 rounded-full bg-primary" />
                        Trusted Tuition Marketplace
                    </Badge>

                    <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Find the right tutor for your goals.
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Explore tuition opportunities by subject, class, and
                        location, then find a learning fit that works for you.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-primary" />
                            Approved tuition posts
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-primary" />
                            Online and in-person options
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/90 p-4 shadow-lg backdrop-blur-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-foreground">
                            Start your search
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Search by subject, class level, or location.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="relative sm:col-span-3">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                aria-label="Search tuition"
                                className="h-11 pl-9"
                                placeholder="e.g. Mathematics, English, or Dhanmondi"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        <Input aria-label="Category" placeholder="Category" />
                        <Input aria-label="Class level" placeholder="Class level" />
                        <Input aria-label="Location" placeholder="Location" />
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/tuitions"
                            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                            Browse all tuitions
                            <ArrowRight className="size-4" />
                        </Link>
                        <Button
                            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary-hover sm:w-auto"
                            onClick={handleSearch}
                        >
                            <Search className="size-4" />
                            Search tuitions
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
