
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Bell,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Search,
    UserRoundPen,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { clearJwtToken } from "@/lib/jwt-token";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggle from "@/components/shared/ThemeToggle";

type UserRole = "student" | "tutor" | "admin";

// Capitalize a string
const capitalize = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

// Derive a readable page title from the current pathname
const getPageTitle = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];

    if (!last || last === "dashboard") return "Dashboard";

    const label = capitalize(last.replace(/-/g, " "));

    return segments[segments.length - 2] === "dashboard"
        ? `${label} Dashboard`
        : label;
};

// Generate user initials
const getInitials = (name: string) => {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

// Role badge
function RoleBadge({ role }: { role: UserRole }) {
    const styles: Record<UserRole, string> = {
        student:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
        tutor:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
        admin:
            "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
    };

    return (
        <Badge variant="outline" className={`capitalize ${styles[role]}`}>
            {role}
        </Badge>
    );
}

// Main Dashboard Header
export default function DashboardHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const [isSigningOut, setIsSigningOut] = useState(false);

    // Better Auth session
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    const user = session?.user;

    // Keep dashboard links within the current role area if the client session
    // briefly omits the role while it is being refreshed.
    const pathRole = pathname.split("/")[2];
    const roleFromPath: UserRole | undefined =
        pathRole === "student" || pathRole === "tutor" || pathRole === "admin"
            ? pathRole
            : undefined;
    const sessionRole = user?.role;
    const userRole: UserRole | undefined =
        sessionRole === "student" ||
        sessionRole === "tutor" ||
        sessionRole === "admin"
            ? sessionRole
            : roleFromPath;

    const dashboardHref = userRole
        ? `/dashboard/${userRole}`
        : "/login";

    const profileHref = userRole
        ? `/dashboard/${userRole}/profile`
        : "/login";

    // Better Auth sign out
    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);

            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "Failed to sign out.");
                return;
            }

            clearJwtToken();
            toast.success("You have signed out successfully.");

            router.replace("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 h-16 w-full border-b border-primary/15 bg-card/95 shadow-md shadow-foreground/5 backdrop-blur-md">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                {/* Sidebar Toggle + Page Title */}
                <div className="flex min-w-0 items-center gap-3">
                    <SidebarTrigger className="shrink-0" />
                    <Separator orientation="vertical" className="h-5" />
                    <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {getPageTitle(pathname)}
                    </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            aria-label="Search dashboard"
                            className="h-9 w-56 rounded-full bg-slate-100 pl-9 dark:bg-slate-900"
                        />
                    </div>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Notifications"
                        className="relative rounded-full"
                        onClick={() =>
                            toast.info("You have no new notifications.")
                        }
                    >
                        <Bell className="size-5" />
                        <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950" />
                    </Button>

                    {/* Theme */}
                    <ThemeToggle />

                    {/* Authentication */}
                    {isPending ? (
                        <div className="h-9 w-28 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
                    ) : !user ? (
                        <Link
                            href="/login"
                            className={buttonVariants({
                                className:
                                    "bg-blue-600 text-white hover:bg-blue-700",
                            })}
                        >
                            Sign In
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        className="flex h-auto items-center gap-2 px-2 py-1.5"
                                    />
                                }
                            >
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src={user.image || ""}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="hidden flex-col items-start sm:flex">
                                    <span className="max-w-32 truncate text-sm font-semibold">
                                        {user.name}
                                    </span>

                                    {userRole && <RoleBadge role={userRole} />}
                                </div>

                                <ChevronDown className="size-4 text-slate-500" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-60">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col gap-1">
                                            <span>{user.name}</span>
                                            <span className="text-xs font-normal text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem>
                                    <Link href={dashboardHref}>
                                        <LayoutDashboard className="mr-2 size-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link href={profileHref}>
                                        <UserRoundPen className="mr-2 size-4" />
                                        Update Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 size-4" />
                                    {isSigningOut
                                        ? "Signing out..."
                                        : "Sign Out"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
