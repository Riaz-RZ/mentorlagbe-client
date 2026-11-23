import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="flex min-h-[65vh] flex-1 items-center justify-center px-4 py-16">
            <div className="surface-3d w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl sm:p-12">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary-hover">
                    ERROR 404
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Page not found
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    The page you are looking for may have moved or no longer
                    exists.
                </p>
                <Link
                    className={buttonVariants({ className: "mt-7", size: "lg" })}
                    href="/"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
