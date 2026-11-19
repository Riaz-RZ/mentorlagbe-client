"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
    BadgeCheck,
    BookOpen,
    ClipboardList,
    FilePlus2,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    UserRoundPen,
    UserRoundSearch,
    Users,
    Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
        {
            label: "Preference",
            items: [
                {
                    title: "Update Profile",
                    href: "/student/profile",
                    icon: UserRoundPen,
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
        {
            label: "Preference",
            items: [
                {
                    title: "Update Profile",
                    href: "/tutor/profile",
                    icon: UserRoundPen,
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
        {
            label: "Preference",
            items: [
                {
                    title: "Update Profile",
                    href: "/admin/profile",
                    icon: UserRoundPen,
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

interface SidebarUserCardProps {
    name: string;
    image?: string | null;
    role: UserRole;
}

const roleBadgeStyles: Record<UserRole, string> = {
    student:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    tutor:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    admin:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
};

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// Signed-in user card shown between the brand header and the nav content.
function SidebarUserCard({ name, image, role }: SidebarUserCardProps) {
    return (
        <div className="mx-2 mb-1 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 group-data-[collapsible=icon]:mx-1! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! dark:border-slate-800 dark:bg-slate-900">
            <Avatar className="size-9 shrink-0">
                <AvatarImage src={image || ""} alt={name} />
                <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {name}
                </p>

                <Badge
                    variant="outline"
                    className={`mt-1 capitalize ${roleBadgeStyles[role]}`}
                >
                    {role}
                </Badge>
            </div>
        </div>
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
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const rawRole = session?.user?.role as UserRole | undefined;
    const role =
        rawRole && ["student", "tutor", "admin"].includes(rawRole)
            ? rawRole
            : undefined;

    const user = session?.user;

    // Wait for the session, then only render for a known dashboard role.
    if (!isPending && !role) return null;

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);

            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "Failed to sign out.");
                return;
            }

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
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarBrand />
            </SidebarHeader>

            {/* User: picture, name and role */}
            {user && role && (
                <SidebarUserCard
                    name={user.name}
                    image={user.image}
                    role={role}
                />
            )}

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
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            tooltip="Sign Out"
                            className="text-red-600! hover:text-red-600! dark:text-red-400! dark:hover:text-red-400!"
                        >
                            <LogOut />
                            <span>
                                {isSigningOut
                                    ? "Signing out..."
                                    : "Sign Out"}
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
