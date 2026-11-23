import { requireRole } from "@/lib/requireRole";
import React, { Suspense } from "react";

async function ProtectedContent({
    role,
    children,
}: {
    role: string;
    children: React.ReactNode;
}) {
    await requireRole(role);
    return children;
}

export default function RoleGuard({
    role,
    children,
}: {
    role: string;
    children: React.ReactNode;
}) {
    return (
        <Suspense
            fallback={
                <div className="p-4 text-sm text-muted-foreground" role="status">
                    Checking access...
                </div>
            }
        >
            <ProtectedContent role={role}>{children}</ProtectedContent>
        </Suspense>
    );
}
