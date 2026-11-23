"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Crown, Mail } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
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

// One row of GET /api/payments (Stripe webhook writes these in Phase 5).
interface Payment {
    _id: string;
    userName: string;
    userEmail: string;
    userRole: string; // student | tutor | admin
    planName: string; // e.g. "Pro Tutor Plan"
    amount: number;
    transactionId: string;
    paymentStatus: string; // paid | ...
    paidAt: string;
}

// Badge color per role (mirrors the screenshot).
const roleBadgeStyles: Record<string, string> = {
    admin:
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    tutor:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    student:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
};

// "Oct 31, 2026" style date.
const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// =============================================================
// Admin > Transaction History: audit trail of Pro subscription
// upgrades processed through Stripe checkout (Phase 5).
// =============================================================
const TransactionsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const role = session?.user?.role as string | undefined;

    // Load the payment log (admin only).
    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/login");
            return;
        }

        if (role && role !== "admin") {
            router.replace(`/dashboard/${role}`);
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const data = await apiGet<Payment[]>("/api/payments");
                if (!cancelled) setPayments(data);
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load transactions."
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
    }, [isPending, session, role, router]);

    // Session still loading (or signed out - the effect redirects).
    if (isPending || !session) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* ================= Header ================= */}
            <DashboardPageHeader
                eyebrow="ADMIN CONTROL CENTER"
                title="Transaction History"
                description="Audit trail of Pro subscription upgrades processed through Stripe checkout."
                icon={CreditCard}
            />

            {/* ================= Table ================= */}
            {isLoading ? (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 p-4 shadow-lg shadow-primary/5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : payments.length === 0 ? (
                /* Empty state - no Stripe payments yet */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-linear-to-br from-card to-primary/5 py-16 text-center shadow-inner">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10 transform-[perspective(700px)_rotateY(10deg)]">
                        <Crown className="size-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No transactions yet
                    </h2>
                    <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        Pro subscription payments will appear here once the
                        Stripe checkout integration goes live.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/5">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-800/60 dark:hover:bg-slate-800/60">
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    User
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Role
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Plan Purchased
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Amount
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Transaction ID
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Status
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Paid Date
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment._id}>
                                    {/* USER */}
                                    <TableCell>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                            {payment.userName || "Unknown"}
                                        </p>
                                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                            <Mail className="size-3" />
                                            {payment.userEmail}
                                        </p>
                                    </TableCell>

                                    {/* ROLE */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                roleBadgeStyles[
                                                    payment.userRole
                                                ] ?? roleBadgeStyles.student
                                            }
                                        >
                                            {payment.userRole}
                                        </Badge>
                                    </TableCell>

                                    {/* PLAN PURCHASED */}
                                    <TableCell>
                                        <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                                            <Crown className="size-4" />
                                            {payment.planName}
                                        </span>
                                    </TableCell>

                                    {/* AMOUNT */}
                                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                                        ${payment.amount}
                                    </TableCell>

                                    {/* TRANSACTION ID */}
                                    <TableCell>
                                        <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            {payment.transactionId}
                                        </code>
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <span
                                            className={`flex items-center gap-1.5 text-sm font-medium ${
                                                payment.paymentStatus === "paid"
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-amber-600 dark:text-amber-400"
                                            }`}
                                        >
                                            <span
                                                className={`size-1.5 rounded-full ${
                                                    payment.paymentStatus ===
                                                    "paid"
                                                        ? "bg-emerald-500"
                                                        : "bg-amber-500"
                                                }`}
                                            />
                                            {payment.paymentStatus}
                                        </span>
                                    </TableCell>

                                    {/* PAID DATE */}
                                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(payment.paidAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
