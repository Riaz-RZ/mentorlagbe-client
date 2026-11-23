import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div
            aria-label="Loading dashboard"
            className="space-y-5"
            role="status"
        >
            <span className="sr-only">Loading dashboard content...</span>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-32 rounded-2xl"
                    />
                ))}
            </div>
            <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
    );
}
