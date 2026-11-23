"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Inbox, Mail, Phone, RefreshCw, Users, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";
import { apiPatch } from "@/lib/actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";

// One application document (same shape as the student side).
interface Application {
    _id: string;
    tuitionId: string;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorEmail: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    preferredSchedule: string;
    studentNote: string;
    status: string; // pending | accepted | rejected
    appliedAt: string;
}

// Badge colors per status.
const statusStyles: Record<string, string> = {
    pending:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    accepted:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

// Schedule value -> readable label.
const scheduleLabels: Record<string, string> = {
    flexible: "Flexible / Discuss with Tutor",
    morning: "Morning (6 AM - 12 PM)",
    afternoon: "Afternoon (12 PM - 5 PM)",
    evening: "Evening (5 PM - 10 PM)",
};

// Avatar background colors (cycled by row position).
const avatarColors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-purple-600",
    "bg-orange-600",
    "bg-rose-600",
];

// Generate initials for the student avatar.
const getInitials = (name: string, email: string) =>
    (name || email)
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const ManageApplicantsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // bump = refetch

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
                const data = await apiGet<Application[]>(
                    `/api/applications/tutor?tutorEmail=${encodeURIComponent(tutorEmail)}`
                );
                if (!cancelled) setApplications(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load applicants."
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
    }, [isPending, tutorEmail, refreshKey, router]);

    // Tutor accepts / rejects one application (status is saved in MongoDB,
    // so the student's My Applications page shows it too).
    const handleRespond = async (
        application: Application,
        status: "accepted" | "rejected"
    ) => {
        try {
            const updated = await apiPatch<Application>(
                `/api/applications/${application._id}/status`,
                { status }
            );

            // Replace that row with the updated application.
            setApplications((prev) =>
                prev.map((item) =>
                    item._id === updated._id ? updated : item
                )
            );

            toast.success(
                status === "accepted"
                    ? "Application accepted."
                    : "Application rejected."
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update application."
            );
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Refresh button (top right) */}
            <DashboardPageHeader
                eyebrow="TUTOR WORKSPACE"
                title="Manage Applicants"
                description="Review candidate applications submitted to your courses and approve or decline students."
                icon={Users}
                action={
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsLoading(true);
                            setRefreshKey((key) => key + 1);
                        }}
                    >
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>
                }
            />

            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Applicants
                    </CardTitle>
                    <CardDescription>
                        {applications.length} application
                        {applications.length === 1 ? "" : "s"} found
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                            <Inbox className="size-10 text-slate-400" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                No applications yet. Students who apply to
                                your tuitions will appear here.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push("/dashboard/tutor/my-tuitions")
                                }
                            >
                                My Tuitions
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Tuition Course</TableHead>
                                    <TableHead>Schedule &amp; Note</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {applications.map((application, index) => (
                                    <TableRow key={application._id}>
                                        {/* Student: avatar + email + applied date */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                                                        avatarColors[
                                                            index %
                                                                avatarColors.length
                                                        ]
                                                    }`}
                                                >
                                                    {getInitials(
                                                        application.studentName,
                                                        application.studentEmail
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {application.studentEmail}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Applied{" "}
                                                        {new Date(
                                                            application.appliedAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Contact: email + phone */}
                                        <TableCell>
                                            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                                <p className="flex items-center gap-1.5">
                                                    <Mail className="size-3.5 text-slate-400" />
                                                    {application.studentEmail}
                                                </p>
                                                <p className="flex items-center gap-1.5">
                                                    <Phone className="size-3.5 text-slate-400" />
                                                    {application.studentPhone}
                                                </p>
                                            </div>
                                        </TableCell>

                                        {/* Tuition: title + subject */}
                                        <TableCell>
                                            <p className="max-w-56 truncate text-sm font-medium">
                                                {application.tuitionTitle}
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-sky-400">
                                                {application.subject}
                                            </p>
                                        </TableCell>

                                        {/* Schedule + note */}
                                        <TableCell>
                                            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                                <p>
                                                    {scheduleLabels[
                                                        application.preferredSchedule
                                                    ] ??
                                                        application.preferredSchedule}
                                                </p>
                                                {application.studentNote && (
                                                    <p className="max-w-44 truncate text-slate-400 dark:text-slate-500">
                                                        {application.studentNote}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Status badge */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${
                                                    statusStyles[
                                                        application.status
                                                    ] ?? statusStyles.pending
                                                }`}
                                            >
                                                {application.status}
                                            </Badge>
                                        </TableCell>

                                        {/* Actions: Accept / Reject while pending */}
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                {application.status ===
                                                "pending" ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                                                            onClick={() =>
                                                                handleRespond(
                                                                    application,
                                                                    "accepted"
                                                                )
                                                            }
                                                        >
                                                            <Check className="size-3.5" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-red-600 text-white hover:bg-red-700"
                                                            onClick={() =>
                                                                handleRespond(
                                                                    application,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            <X className="size-3.5" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <span className="text-sm italic text-slate-400 dark:text-slate-500">
                                                        Responded
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

export default ManageApplicantsPage;
