
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Menu,
  LayoutDashboard,
  UserRoundPen,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Navigation configuration
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
];

// User types
export type UserRole = "student" | "tutor" | "admin";

export interface NavbarUser {
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

interface NavbarProps {
  user?: NavbarUser | null;
  onSignOut?: () => void;
}

// Role-based routes
const getDashboardRoute = (role: UserRole) => {
  return `/${role}/dashboard`;
};

const getProfileRoute = (role: UserRole) => {
  return `/${role}/profile`;
};

// Brand component
function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <GraduationCap className="size-6" />
      </div>

      <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
        Mentor<span className="text-blue-600 dark:text-sky-400">Lagbe</span>
      </span>
    </Link>
  );
}

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
    <Badge
      variant="outline"
      className={`capitalize ${styles[role]}`}
    >
      {role}
    </Badge>
  );
}

// Main navbar
export default function Navbar({
  user = null,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dashboardHref = user
    ? getDashboardRoute(user.role)
    : "/login";

  const profileHref = user
    ? getProfileRoute(user.role)
    : "/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Brand />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-blue-600 dark:text-sky-400"
                  : "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-sky-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <Button variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>

              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="flex h-auto items-center gap-2 px-2 py-1.5"
                  >
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-start">
                      <span className="max-w-32 truncate text-sm font-semibold">
                        {user.name}
                      </span>
                      <RoleBadge role={user.role} />
                    </div>

                    <ChevronDown className="size-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span>{user.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>

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
                    onClick={onSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        >
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-75 flex-col sm:w-87.5"
          >
            <div className="mt-6">
              <Brand />
            </div>

            {/* Mobile User Information */}
            {user && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-blue-50 p-3 dark:bg-slate-900">
                <Avatar className="size-11">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user.name}
                  </p>
                  <RoleBadge role={user.role} />
                </div>
              </div>
            )}

            {/* Mobile Links */}
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-sky-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t pt-5">
              {!user ? (
                <>
                  <Button variant="outline">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>

                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </Button>

                  <Button variant="outline">
                    <Link
                      href={profileHref}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserRoundPen className="mr-2 size-4" />
                      Update Profile
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut?.();
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
