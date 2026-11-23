"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { clearJwtToken, getJwtToken } from "@/lib/jwt-token";

export default function GoogleAuthCallbackPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const callbackHandled = useRef(false);

    useEffect(() => {
        if (callbackHandled.current) {
            return;
        }

        const callbackParams = new URLSearchParams(window.location.search);
        const oauthError = callbackParams.get("error");
        const returnToSignup = callbackParams.get("from") === "signup";

        if (oauthError) {
            callbackHandled.current = true;
            const description = callbackParams.get("error_description");
            toast.error(
                description || `Google authentication failed (${oauthError}).`
            );
            router.replace(returnToSignup ? "/signup" : "/login");
            return;
        }

        if (isPending) {
            return;
        }

        callbackHandled.current = true;

        if (!session?.user) {
            toast.error("Google sign-in failed. Please try again.");
            router.replace(returnToSignup ? "/signup" : "/login");
            return;
        }

        const completeGoogleSignIn = async () => {
            try {
                clearJwtToken();
                if (!(await getJwtToken())) {
                    throw new Error(
                        "Google sign-in succeeded, but the API token could not be retrieved."
                    );
                }

                const role = session.user.role;
                const dashboard =
                    role === "admin"
                        ? "/dashboard/admin"
                        : role === "tutor"
                          ? "/dashboard/tutor"
                          : role === "student"
                            ? "/dashboard/student"
                            : null;

                if (!dashboard) {
                    throw new Error("Your account does not have a supported role.");
                }

                toast.success("Google sign-in successful. Welcome to MentorLagbe!");
                router.replace(dashboard);
                router.refresh();
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Google sign-in could not be completed."
                );
                router.replace("/login");
            }
        };

        void completeGoogleSignIn();
    }, [isPending, router, session]);

    return (
        <main className="flex min-h-[50vh] items-center justify-center px-4">
            <p role="status" className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Finishing Google sign-in...
            </p>
        </main>
    );
}
