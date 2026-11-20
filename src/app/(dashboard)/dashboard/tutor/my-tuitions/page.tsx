"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FilePlus2, Inbox } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Tuition {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: string;
    location: string;
    monthlyFee: number;
    approvalStatus: "pending" | "approved" | "rejected";
    createdAt: string;
}

const statusStyles: Record<Tuition["approvalStatus"], string> = {
    pending:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    approved:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

const MyTuitionsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const tutorEmail = session?.user?.email;

    useEffect(() => {
        if (isPending) return;

        if (!tutorEmail) {
            router.replace("/login");
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Tuition[]>(
                    `/api/tuitions/mine?tutorEmail=${encodeURIComponent(tutorEmail)}`
                );
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
    }, [isPending, tutorEmail, router]);

    return (
        <div className="space-y-4">
            {/* Header with the Post a Tuition button (top right) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        My Tuitions
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tuitions you have posted, with their approval status.
                    </p>
                </div>

                <Button onClick={() => router.push("/dashboard/tutor/post-tuition")}>
                    <FilePlus2 className="size-4" />
                    Post a Tuition
                </Button>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Tuitions</CardTitle>
                    <CardDescription>
                        {tuitions.length} post{tuitions.length === 1 ? "" : "s"} found
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : tuitions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <Inbox className="size-10 text-slate-400" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                You haven&apos;t posted any tuition yet.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push("/dashboard/tutor/post-tuition")
                                }
                            >
                                <FilePlus2 className="size-4" />
                                Post your first tuition
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Class Level</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead>Monthly Fee</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {tuitions.map((tuition) => (
                                    <TableRow key={tuition._id}>
                                        <TableCell className="font-medium">
                                            {tuition.title}
                                        </TableCell>
                                        <TableCell>{tuition.subject}</TableCell>
                                        <TableCell>{tuition.classLevel}</TableCell>
                                        <TableCell className="capitalize">
                                            {tuition.mode}
                                        </TableCell>
                                        <TableCell>৳{tuition.monthlyFee}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${
                                                    statusStyles[tuition.approvalStatus] ??
                                                    statusStyles.pending
                                                }`}
                                            >
                                                {tuition.approvalStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400">
                                            {new Date(tuition.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Small helper note */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
                New posts stay{" "}
                <Link
                    href="/dashboard/tutor/post-tuition"
                    className="underline hover:text-blue-600"
                >
                    pending
                </Link>{" "}
                until an admin approves them.
            </p>
        </div>
    );
};

export default MyTuitionsPage;
