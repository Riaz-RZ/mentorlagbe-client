"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, FilePlus2, Inbox, Pencil, Trash2 } from "lucide-react";

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

import {
    DeleteTuitionDialog,
    EditTuitionDialog,
    ViewTuitionDialog,
    type Tuition,
} from "@/components/dashboard/tutor/TuitionDialogs";

const statusStyles: Record<Tuition["approvalStatus"], string> = {
    pending:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    approved:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

const activeStyles = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    close: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const MyTuitionsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Which dialog is open (null = none). One state per action.
    const [viewTuition, setViewTuition] = useState<Tuition | null>(null);
    const [editTuition, setEditTuition] = useState<Tuition | null>(null);
    const [deleteTuition, setDeleteTuition] = useState<Tuition | null>(null);

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

    // After a successful edit: replace that row with the updated data.
    const handleSaved = (updated: Tuition) => {
        setTuitions((prev) =>
            prev.map((tuition) => (tuition._id === updated._id ? updated : tuition))
        );
        setEditTuition(null);
    };

    // After a successful delete: remove that row from the table.
    const handleDeleted = (deletedId: string) => {
        setTuitions((prev) =>
            prev.filter((tuition) => tuition._id !== deletedId)
        );
        setDeleteTuition(null);
    };

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
                                    <TableHead>Active</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
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
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${
                                                    tuition.isActive
                                                        ? activeStyles.active
                                                        : activeStyles.close
                                                }`}
                                            >
                                                {tuition.isActive ? "Active" : "Close"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400">
                                            {new Date(tuition.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    title="View"
                                                    aria-label="View tuition"
                                                    onClick={() => setViewTuition(tuition)}
                                                >
                                                    <Eye />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    title="Edit"
                                                    aria-label="Edit tuition"
                                                    onClick={() => setEditTuition(tuition)}
                                                >
                                                    <Pencil />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    title="Delete"
                                                    aria-label="Delete tuition"
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => setDeleteTuition(tuition)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
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

            {/* Dialogs - only mounted while a tuition is selected */}
            {viewTuition && (
                <ViewTuitionDialog
                    tuition={viewTuition}
                    onOpenChange={(open) => {
                        if (!open) setViewTuition(null);
                    }}
                />
            )}

            {editTuition && (
                <EditTuitionDialog
                    tuition={editTuition}
                    onOpenChange={(open) => {
                        if (!open) setEditTuition(null);
                    }}
                    onSaved={handleSaved}
                />
            )}

            {deleteTuition && (
                <DeleteTuitionDialog
                    tuition={deleteTuition}
                    onOpenChange={(open) => {
                        if (!open) setDeleteTuition(null);
                    }}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
};

export default MyTuitionsPage;
