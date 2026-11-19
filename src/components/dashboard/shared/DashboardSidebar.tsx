"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
    BadgeCheck,
    BookOpen,
    ClipboardList,
    FilePlus2,
    GraduationCap,
    Home,
    LayoutDashboard,
    UserRoundSearch,
    Users,
    Wallet,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type UserRole = "student" | "tutor" | "admin";

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

const navigationItems: Record<UserRole, NavGroup[]> = {
    student: [
        {
            label: "Overview",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard/student",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: "Applications",
            items: [
                {
                    title: "My Applications",
                    href: "/dashboard/student/my-applications",
                    icon: ClipboardList,
                },
            ],
        },
    ],

    tutor: [
        {
            label: "Overview",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard/tutor",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: "Tuition",
            items: [
                {
                    title: "Post a Tuition",
                    href: "/dashboard/tutor/post-tuition",
                    icon: FilePlus2,
                },
                {
                    title: "My Tuitions",
                    href: "/dashboard/tutor/my-tuitions",
                    icon: BookOpen,
                },
                {
                    title: "Manage Applicants",
                    href: "/dashboard/tutor/applicants",
                    icon: UserRoundSearch,
                },
            ],
        },
    ],

    admin: [
        {
            label: "Overview",
            items: [
                {
                    title: "Overview",
                    href: "/dashboard/admin",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: "Management",
            items: [
                {
                    title: "User Management",
                    href: "/dashboard/admin/users",
                    icon: Users,
                },
                {
                    title: "Tuition Approvals",
                    href: "/dashboard/admin/tuitions",
                    icon: BadgeCheck,
                },
                {
                    title: "Transactions",
                    href: "/dashboard/admin/transactions",
                    icon: Wallet,
                },
            ],
        },
    ],
};

// An item is active when the pathname matches it exactly, or when it owns the
// current path. A parent item (e.g. the role overview) does not stay active
// while a deeper nav item is the page actually open.
function isItemActive(pathname: string, item: NavItem, allItems: NavItem[]) {
    if (pathname === item.href) return true;

    if (!pathname.startsWith(`${item.href}/`)) return false;

    return !allItems.some(
        (other) =>
            other.href !== item.href &&
            other.href.startsWith(`${item.href}/`) &&
            (pathname === other.href ||
                pathname.startsWith(`${other.href}/`))
    );
}

function SidebarBrand() {
    return (
        <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="size-5" />
            </span>

            <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-base font-bold text-blue-700 dark:text-blue-400">
                    MentorLagbe
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    Dashboard
                </span>
            </span>
        </Link>
    );
}

interface SidebarNavProps {
    role: UserRole;
}

function SidebarNav({ role }: SidebarNavProps) {
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();

    const groups = navigationItems[role];
    const allItems = groups.flatMap((group) => group.items);

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            render={<Link href={item.href} />}
                                            isActive={isItemActive(
                                                pathname,
                                                item,
                                                allItems
                                            )}
                                            tooltip={item.title}
                                            onClick={() =>
                                                setOpenMobile(false)
                                            }
                                        >
                                            <Icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}

export default function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession();

    const rawRole = session?.user?.role as UserRole | undefined;
    const role =
        rawRole && ["student", "tutor", "admin"].includes(rawRole)
            ? rawRole
            : undefined;

    // Wait for the session, then only render for a known dashboard role.
    if (!isPending && !role) return null;

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarBrand />
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                {isPending ? (
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <SidebarMenuItem key={index}>
                                        <div className="flex h-8 items-center gap-2 rounded-md px-2">
                                            <Skeleton className="size-4 rounded-md" />
                                            <Skeleton className="h-4 flex-1" />
                                        </div>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ) : role ? (
                    <SidebarNav role={role} />
                ) : null}
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href="/" />}
                            tooltip="Back to Website"
                        >
                            <Home />
                            <span>Back to Website</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
