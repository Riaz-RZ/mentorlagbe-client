import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireRole = async (role: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
        query: { disableCookieCache: true },
    });

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== role) {
        redirect("/unauthorized");
    }

    return session;
};