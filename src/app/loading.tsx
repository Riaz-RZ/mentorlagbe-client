import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main
            aria-label="Loading page"
            className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8"
            role="status"
        >
            <span className="sr-only">Loading page content...</span>
            <div className="space-y-3">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-40 rounded-2xl"
                    />
                ))}
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
        </main>
    );
}
