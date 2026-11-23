"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-[65vh] flex-1 items-center justify-center px-4 py-16">
            <div className="surface-3d w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl sm:p-12">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary-hover">
                    SOMETHING WENT WRONG
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    We couldn&apos;t load this page
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    Please try again. If the problem continues, return home and
                    try again later.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button onClick={retry} size="lg" type="button">
                        Try again
                    </Button>
                    <Link
                        className={buttonVariants({
                            className: "bg-background",
                            size: "lg",
                            variant: "outline",
                        })}
                        href="/"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
