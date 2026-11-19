
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    LayoutDashboard,
    UserRound,
    Search,
    CalendarDays,
    Heart,
    MessageSquare,
    Wallet,
    BookOpen,
    Users,
    GraduationCap,
    Settings,
    ShieldCheck,
    CreditCard,
    Star,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type UserRole = "student" | "tutor" | "admin";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const navigationItems: Record<UserRole, NavItem[]> = {
    student: [
        {
            title: "Dashboard",
            href: "/dashboard/student",
            icon: LayoutDashboard,
        },
        {
            title: "Browse Tutors",
            href: "/student/tutors",
            icon: Search,
        },
        {
            title: "My Bookings",
            href: "/student/bookings",
            icon: CalendarDays,
        },
        {
            title: "Favorites",
            href: "/student/favorites",
            icon: Heart,
        },
        {
            title: "Messages",
            href: "/student/messages",
            icon: MessageSquare,
        },
        {
            title: "Payments",
            href: "/student/payments",
            icon: CreditCard,
        },
        {
            title: "My Reviews",
            href: "/student/reviews",
            icon: Star,
        },
        {
            title: "My Profile",
            href: "/student/profile",
            icon: UserRound,
        },
    ],

    tutor: [
        {
            title: "Dashboard",
            href: "/dashboard/tutor",
            icon: LayoutDashboard,
        },
        {
            title: "My Profile",
            href: "/tutor/profile",
            icon: UserRound,
        },
        {
            title: "My Bookings",
            href: "/tutor/bookings",
            icon: CalendarDays,
        },
        {
            title: "My Students",
            href: "/tutor/students",
            icon: Users,
        },
        {
            title: "My Schedule",
            href: "/tutor/schedule",
            icon: BookOpen,
        },
        {
            title: "Messages",
            href: "/tutor/messages",
            icon: MessageSquare,
        },
        {
            title: "Earnings",
            href: "/tutor/earnings",
            icon: Wallet,
        },
        {
            title: "Reviews",
            href: "/tutor/reviews",
            icon: Star,
        },
    ],

    admin: [
        {
            title: "Dashboard",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Manage Users",
            href: "/admin/users",
            icon: Users,
        },
        {
            title: "Manage Tutors",
            href: "/admin/tutors",
            icon: GraduationCap,
        },
        {
            title: "Tutor Verification",
            href: "/admin/verifications",
            icon: ShieldCheck,
        },
        {
            title: "Manage Bookings",
            href: "/admin/bookings",
            icon: CalendarDays,
        },
        {
            title: "Payments",
            href: "/admin/payments",
            icon: CreditCard,
        },
        {
            title: "Manage Reviews",
            href: "/admin/reviews",
            icon: Star,
        },
        {
            title: "Settings",
            href: "/admin/settings",
            icon: Settings,
        },
    ],
};

interface SidebarContentProps {
    role: UserRole;
    onNavigate?: () => void;
}

function SidebarContent({ role, onNavigate }: SidebarContentProps) {
    const pathname = usePathname();
    const items = navigationItems[role];

    return (
        <div className="flex h-full flex-col">
            {/* Brand */}
            <Link
                href="/"
                onClick={onNavigate}
                className="flex items-center gap-3 px-6 py-6"
            >
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <GraduationCap className="size-6" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                        MentorLagbe
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dashboard
                    </p>
                </div>
            </Link>

            <Separator />

            {/* Navigation */}
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Main Menu
                </p>

                {items.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                            }`}
                        >
                            <Icon className="size-5 shrink-0" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </div>

            <Separator />

            {/* Footer */}
            <div className="p-4">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <LayoutDashboard className="size-5" />
                    Back to Website
                </Link>
            </div>
        </div>
    );
}

export default function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession();
    const [open, setOpen] = useState(false);

    if (isPending) {
        return (
            <aside className="hidden h-screen w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
                <div className="space-y-4 p-6">
                    <div className="h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
            </aside>
        );
    }

    if (!session?.user) return null;

    const role = session.user.role as UserRole;

    if (!["student", "tutor", "admin"].includes(role)) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
                <SidebarContent role={role} />
            </aside>

            {/* Mobile Sidebar */}
            <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="size-7 text-blue-600" />
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                        MentorLagbe
                    </span>
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Open dashboard menu"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-72 p-0"
                    >
                        <SidebarContent
                            role={role}
                            onNavigate={() => setOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
