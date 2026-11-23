"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, XCircle, CheckCircle2, Clock } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { Button } from "@/components/ui/button";

// Four states of the post-checkout check.
type Status = "verifying" | "success" | "processing" | "error";

// The webhook writes the payment; this page only polls for it.
const MAX_ATTEMPTS = 12;
const POLL_INTERVAL_MS = 1500; // ~18s total before showing "processing"

// =============================================================
// Stripe redirects here after checkout (?session_id=...).
// The webhook (source of truth) records the payment and flips the
// plan to "pro" - this page just polls the read-only status
// endpoint until that row appears, then celebrates.
// =============================================================
const PaymentSuccessPage = () => {
    const router = useRouter();
    const {
        data: session,
        refetch: refreshSession,
    } = authClient.useSession();

    const [status, setStatus] = useState<Status>("verifying");
    const [message, setMessage] = useState("");
    const [retryKey, setRetryKey] = useState(0); // bump to poll again

    // Better Auth types role as "student" | "tutor" (admin in DB).
    const role = (session?.user?.role as string | undefined) ?? "student";

    useEffect(() => {
        let cancelled = false;

        const wait = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        const check = async () => {
            // Read session_id straight from the URL (no useSearchParams,
            // so no Suspense boundary is needed).
            const sessionId = new URLSearchParams(window.location.search).get(
                "session_id"
            );

            if (!sessionId) {
                if (!cancelled) {
                    setStatus("error");
                    setMessage("Missing checkout session id.");
                }
                return;
            }

            // Poll until the webhook has written the payment row.
            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                if (cancelled) return;

                try {
                    const data = await apiGet<{ recorded: boolean }>(
                        `/api/payments/status?sessionId=${encodeURIComponent(sessionId)}`
                    );
                    if (data?.recorded) {
                        await refreshSession({
                            query: { disableCookieCache: true },
                        });
                        if (!cancelled) setStatus("success");
                        return;
                    }
                } catch {
                    // API unreachable - keep polling; report at the end.
                }

                await wait(POLL_INTERVAL_MS);
            }

            // Timed out: the payment may still be settling. NOT an error -
            // the user was (likely) charged, the webhook just hasn't landed.
            if (!cancelled) setStatus("processing");
        };

        check();
        return () => {
            cancelled = true;
        };
    }, [refreshSession, retryKey]);

    // Warn on the error state (once).
    useEffect(() => {
        if (status === "error") toast.error(message || "Payment failed.");
    }, [status, message]);

    // "Check again" on the processing state.
    const recheck = () => {
        setStatus("verifying");
        setRetryKey((key) => key + 1);
    };

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            {/* ================= Verifying ================= */}
            {status === "verifying" && (
                <>
                    <Loader2 className="size-12 animate-spin text-emerald-600" />
                    <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Confirming your payment...
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Hang tight - this usually takes a few seconds.
                    </p>
                </>
            )}

            {/* ================= Success ================= */}
            {status === "success" && (
                <>
                    <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
                        <CheckCircle2 className="size-8" />
                    </span>
                    <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Payment successful! 🎉
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        Welcome to <strong>MentorLagbe PRO</strong> - your plan
                        is now Pro. A receipt is in your Transaction History.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                            onClick={() =>
                                router.push(`/dashboard/${role}`)
                            }
                            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Go to Dashboard
                            <ArrowRight className="size-4" />
                        </Button>
                        <Link href="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                    </div>
                </>
            )}

            {/* ================= Processing (webhook not landed yet) ================= */}
            {status === "processing" && (
                <>
                    <span className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950">
                        <Clock className="size-8" />
                    </span>
                    <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Confirming your payment...
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        We haven&apos;t received your payment confirmation yet.
                        If you completed checkout, Pro activates as soon as
                        Stripe notifies us - this usually takes a few seconds.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                            onClick={recheck}
                            className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Check again
                            <ArrowRight className="size-4" />
                        </Button>
                        <Link href="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                    </div>
                </>
            )}

            {/* ================= Error ================= */}
            {status === "error" && (
                <>
                    <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
                        <XCircle className="size-8" />
                    </span>
                    <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Payment not completed
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                        {message ||
                            "Your payment could not be verified. You were not charged."}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Back to Home
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSuccessPage;
