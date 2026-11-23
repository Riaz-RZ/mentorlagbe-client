"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Search, SearchX, Users } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

// A row from Better Auth's admin list-users endpoint.
interface AdminUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt: string;
    role?: string; // student | tutor | admin
    banned?: boolean | null;
}

// Role dropdown options.
const ROLES: Record<string, string> = {
    student: "Student",
    tutor: "Tutor",
    admin: "Admin",
};

// Badge color per role (same palette as the transactions page).
const roleBadgeStyles: Record<string, string> = {
    admin:
        "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    tutor:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    student:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const initials = (name: string) =>
    name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

// =============================================================
// Admin > User Management: list accounts (Better Auth admin
// plugin), change roles and ban / unban users.
// =============================================================
const UserManagementPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("");
    // id of the row currently saving (role change or ban).
    const [actingId, setActingId] = useState<string | null>(null);

    const role = session?.user?.role as string | undefined;

    // Load every account (admin only - the endpoint enforces it too).
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

        if (role !== "admin") return; // role not ready yet, effect runs again

        let cancelled = false;

        const load = async () => {
            try {
                const res = await authClient.admin.listUsers({
                    query: {
                        limit: 100,
                        sortBy: "createdAt",
                        sortDirection: "desc",
                    },
                });
                if (res.error) throw new Error(res.error.message);
                if (!cancelled) {
                    setUsers((res.data?.users ?? []) as unknown as AdminUser[]);
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load users."
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

    // Client-side search over the loaded list (name or email).
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        );
    }, [users, query]);

    // Better Auth -> POST /api/auth/admin/set-role
    const changeRole = async (user: AdminUser, nextRole: string) => {
        if (user.id === session?.user.id) return;
        setActingId(user.id);
        const { error } = await authClient.admin.setRole({
            userId: user.id,
            // The plugin types this as better-auth's default "user" | "admin".
            // The server accepts any string, and this app uses
            // student / tutor / admin (a custom `role` field).
            role: nextRole as "admin",
        });
        if (error) {
            toast.error(error.message || "Failed to change the role.");
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, role: nextRole } : u
                )
            );
            toast.success(`${user.name} is now ${ROLES[nextRole]}`);
        }
        setActingId(null);
    };

    // Better Auth -> POST /api/auth/admin/ban-user | unban-user
    const toggleBan = async (user: AdminUser) => {
        if (user.id === session?.user.id) return;
        setActingId(user.id);
        const res = user.banned
            ? await authClient.admin.unbanUser({ userId: user.id })
            : await authClient.admin.banUser({
                  userId: user.id,
                  banReason: "Banned by admin",
              });
        if (res.error) {
            toast.error(res.error.message || "Failed to update the user.");
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, banned: !user.banned } : u
                )
            );
            toast.success(
                user.banned
                    ? `${user.name} is active again`
                    : `${user.name} has been banned`
            );
        }
        setActingId(null);
    };

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
                title="User Management"
                description="Search accounts, change roles and manage platform access."
                icon={Users}
                action={
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {users.length} users
                    </span>
                }
            />

            {/* ================= Search ================= */}
            <div className="relative max-w-sm">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-8"
                />
            </div>

            {/* ================= Table ================= */}
            {isLoading ? (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 p-4 shadow-lg shadow-primary/5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-linear-to-br from-card to-primary/5 py-16 text-center shadow-inner">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10 [transform:perspective(700px)_rotateY(10deg)]">
                        <SearchX className="size-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">
                        No users found
                    </h2>
                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        {query
                            ? `Nothing matches "${query}".`
                            : "No accounts have signed up yet."}
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
                                    Status
                                </TableHead>
                                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Joined
                                </TableHead>
                                <TableHead className="text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((user) => {
                                const isSelf = user.id === session.user.id;
                                const busy = actingId === user.id;

                                return (
                                    <TableRow key={user.id}>
                                        {/* USER */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-9">
                                                    <AvatarImage
                                                        src={
                                                            user.image ?? undefined
                                                        }
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {initials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="flex items-center gap-1.5 font-medium">
                                                        {user.name}
                                                        {isSelf && (
                                                            <span className="text-xs text-muted-foreground">
                                                                (you)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail className="size-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* ROLE */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    roleBadgeStyles[
                                                        user.role ?? "student"
                                                    ] ?? roleBadgeStyles.student
                                                }
                                            >
                                                {ROLES[user.role ?? ""] ??
                                                    user.role ??
                                                    "student"}
                                            </Badge>
                                        </TableCell>

                                        {/* STATUS */}
                                        <TableCell>
                                            <span
                                                className={`flex items-center gap-1.5 text-sm font-medium ${
                                                    user.banned
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-emerald-600 dark:text-emerald-400"
                                                }`}
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${
                                                        user.banned
                                                            ? "bg-red-500"
                                                            : "bg-emerald-500"
                                                    }`}
                                                />
                                                {user.banned
                                                    ? "banned"
                                                    : "active"}
                                            </span>
                                        </TableCell>

                                        {/* JOINED */}
                                        <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(user.createdAt)}
                                        </TableCell>

                                        {/* ACTIONS */}
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Select
                                                    items={ROLES}
                                                    value={
                                                        user.role &&
                                                        ROLES[user.role]
                                                            ? user.role
                                                            : "student"
                                                    }
                                                    disabled={isSelf || busy}
                                                    onValueChange={(value) =>
                                                        changeRole(
                                                            user,
                                                            String(value)
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-28">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.keys(
                                                            ROLES
                                                        ).map((value) => (
                                                            <SelectItem
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {
                                                                    ROLES[
                                                                        value
                                                                    ]
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    size="sm"
                                                    variant={
                                                        user.banned
                                                            ? "outline"
                                                            : "destructive"
                                                    }
                                                    disabled={isSelf || busy}
                                                    onClick={() =>
                                                        toggleBan(user)
                                                    }
                                                >
                                                    {busy
                                                        ? "Saving..."
                                                        : user.banned
                                                          ? "Unban"
                                                          : "Ban"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
