import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main
            aria-label="Loading page"
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8"
            role="status"
        >
            <span className="sr-only">Loading page content...</span>
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-5 w-full max-w-2xl" />
                <Skeleton className="h-10 w-36 rounded-lg" />
            </section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-64 rounded-2xl"
                    />
                ))}
            </div>
        </main>
    );
}
