"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClipboardList, Inbox, RefreshCw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

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

// One application document from POST /api/applications.
interface Application {
    _id: string;
    tuitionId: string;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorEmail: string;
    studentPhone: string;
    preferredSchedule: string;
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

const MyApplicationsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // bump = refetch

    const studentEmail = session?.user?.email;

    useEffect(() => {
        if (isPending) return;

        if (!studentEmail) {
            router.replace("/login");
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Application[]>(
                    `/api/applications/mine?studentEmail=${encodeURIComponent(studentEmail)}`
                );
                if (!cancelled) setApplications(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load applications."
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
    }, [isPending, studentEmail, refreshKey, router]);

    return (
        <div className="space-y-5">
            <DashboardPageHeader
                eyebrow="APPLICATION TRACKER"
                title="My Applications"
                description="Tuitions you applied for, with their current status."
                icon={ClipboardList}
                action={
                    <Button
                        variant="outline"
                        className="shadow-md transition-shadow hover:shadow-lg"
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

            <Card className="border-primary/15 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Applications
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
                                <Skeleton key={index} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-background/50 py-12 text-center shadow-inner">
                            <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10 [transform:perspective(700px)_rotateY(10deg)]">
                                <Inbox className="size-8" />
                            </span>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                You haven&apos;t applied to any tuition yet.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/tuitions")}
                            >
                                Browse Tuitions
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tuition</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Monthly Fee</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {applications.map((application) => (
                                    <TableRow
                                        key={application._id}
                                        className="transition-colors hover:bg-primary/5"
                                    >
                                        <TableCell className="font-medium">
                                            {application.tuitionTitle}
                                        </TableCell>
                                        <TableCell>
                                            {application.subject}
                                        </TableCell>
                                        <TableCell>
                                            ৳{application.monthlyFee}
                                        </TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400">
                                            {scheduleLabels[
                                                application.preferredSchedule
                                            ] ?? application.preferredSchedule}
                                        </TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400">
                                            {new Date(
                                                application.appliedAt
                                            ).toLocaleDateString()}
                                        </TableCell>
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

export default MyApplicationsPage;
