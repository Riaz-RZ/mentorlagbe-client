"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck, MapPin, Monitor } from "lucide-react";

import { apiGet } from "@/lib/api";
import { apiPatch } from "@/lib/actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";

import { type Tuition } from "@/components/dashboard/tutor/TuitionDialogs";

type TabKey = "pending" | "approved" | "rejected" | "all";

const statusStyles: Record<Tuition["approvalStatus"], string> = {
    pending:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    approved:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

const TuitionApprovalsPage = () => {
    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<TabKey>("pending");
    // While an approve/reject request is running, disable that row's buttons
    const [actingId, setActingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Tuition[]>("/api/tuitions/all");
                if (!cancelled) setTuitions(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error ? error.message : "Failed to load tuitions."
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

    // Counts come from the full list, so the tabs always match the table.
    const counts = {
        pending: tuitions.filter((t) => t.approvalStatus === "pending").length,
        approved: tuitions.filter((t) => t.approvalStatus === "approved").length,
        rejected: tuitions.filter((t) => t.approvalStatus === "rejected").length,
        all: tuitions.length,
    };

    const visible =
        tab === "all"
            ? tuitions
            : tuitions.filter((t) => t.approvalStatus === tab);

    // Approve / Reject / Reinstate -> one PATCH, then update the row in place.
    const changeStatus = async (
        tuition: Tuition,
        approvalStatus: Tuition["approvalStatus"]
    ) => {
        try {
            setActingId(tuition._id);

            const updated = await apiPatch<Tuition>(
                `/api/tuitions/${tuition._id}/status`,
                { approvalStatus }
            );

            setTuitions((prev) =>
                prev.map((t) => (t._id === updated._id ? updated : t))
            );

            toast.success(`Tuition ${approvalStatus}.`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <DashboardPageHeader
                eyebrow="ADMIN CONTROL CENTER"
                title="Tuition Moderation"
                description="Review, approve, or reject tuition listings submitted by tutors before they become visible to students."
                icon={ClipboardCheck}
            />

            {/* Filter tabs with counts */}
            <Tabs value={tab} onValueChange={(value) => setTab(value as TabKey)}>
                <TabsList variant="line">
                    <TabsTrigger value="pending">
                        Pending <Count n={counts.pending} />
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved <Count n={counts.approved} />
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rejected <Count n={counts.rejected} />
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        All Tuitions <Count n={counts.all} />
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Table */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : visible.length === 0 ? (
                        <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            No {tab === "all" ? "" : tab} tuitions found.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Monthly Fee</TableHead>
                                    <TableHead>Approval Status</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {visible.map((tuition) => (
                                    <TableRow key={tuition._id}>
                                        {/* Title + mode / location */}
                                        <TableCell>
                                            <p className="max-w-56 truncate font-medium">
                                                {tuition.title}
                                            </p>
                                            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                {tuition.mode === "offline" ? (
                                                    <>
                                                        <MapPin className="size-3" />
                                                        {tuition.location || "Offline"}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Monitor className="size-3" />
                                                        Online
                                                    </>
                                                )}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                            >
                                                {tuition.subject}
                                            </Badge>
                                        </TableCell>

                                        {/* Tutor name + email */}
                                        <TableCell>
                                            <p className="font-medium">
                                                {tuition.tutorName || "Unknown"}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {tuition.tutorEmail}
                                            </p>
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            ৳{tuition.monthlyFee}
                                        </TableCell>

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
                                                className={
                                                    tuition.isActive
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                }
                                            >
                                                {tuition.isActive ? "Active" : "Close"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-slate-500 dark:text-slate-400">
                                            {new Date(
                                                tuition.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>

                                        {/* Actions depend on the current status */}
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                {tuition.approvalStatus === "pending" && (
                                                    <>
                                                        <Button
                                                            size="xs"
                                                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                            disabled={actingId === tuition._id}
                                                            onClick={() =>
                                                                changeStatus(tuition, "approved")
                                                            }
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="destructive"
                                                            disabled={actingId === tuition._id}
                                                            onClick={() =>
                                                                changeStatus(tuition, "rejected")
                                                            }
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}

                                                {tuition.approvalStatus === "rejected" && (
                                                    <Button
                                                        size="xs"
                                                        variant="link"
                                                        className="text-emerald-600"
                                                        disabled={actingId === tuition._id}
                                                        onClick={() =>
                                                            changeStatus(tuition, "approved")
                                                        }
                                                    >
                                                        Reinstate
                                                    </Button>
                                                )}

                                                {tuition.approvalStatus === "approved" && (
                                                    <span className="text-xs text-slate-400">
                                                        &mdash;
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Small count pill next to each tab label
function Count({ n }: { n: number }) {
    return (
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {n}
        </span>
    );
}

export default TuitionApprovalsPage;
