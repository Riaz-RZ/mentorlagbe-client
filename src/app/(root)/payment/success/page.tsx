"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, XCircle, CheckCircle2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";

import { Button } from "@/components/ui/button";

// Three states of the verification.
type Status = "verifying" | "success" | "error";

// =============================================================
// Stripe redirects here after checkout (?session_id=...).
// The page asks the backend to confirm the payment WITH Stripe,
// then records it and flips the user's plan to "pro".
// =============================================================
const PaymentSuccessPage = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [status, setStatus] = useState<Status>("verifying");
    const [message, setMessage] = useState("");

    // Better Auth types role as "student" | "tutor" (admin in DB).
    const role = (session?.user?.role as string | undefined) ?? "student";

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
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

            try {
                await apiGet(`/api/payments/verify?sessionId=${encodeURIComponent(sessionId)}`);
                if (!cancelled) setStatus("success");
            } catch (error) {
                if (!cancelled) {
                    setStatus("error");
                    setMessage(
                        error instanceof Error
                            ? error.message
                            : "Payment could not be verified."
                    );
                }
            }
        };

        verify();
        return () => {
            cancelled = true;
        };
    }, []);

    // Warn on the error state (once).
    useEffect(() => {
        if (status === "error") toast.error(message || "Payment failed.");
    }, [status, message]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            {/* ================= Verifying ================= */}
            {status === "verifying" && (
                <>
                    <Loader2 className="size-12 animate-spin text-emerald-600" />
                    <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Verifying your payment...
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Hang tight - this only takes a moment.
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
