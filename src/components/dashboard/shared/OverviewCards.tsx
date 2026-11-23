import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// =============================================================
// Small pieces shared by the student, tutor, and admin dashboard
// overview pages: a stat card and a quick-action row.
// =============================================================

// One stat card (label, big number, note, icon in the corner).
export function StatCard({
    label,
    value,
    note,
    icon: Icon,
    iconClass,
    pill,
    pillClass,
}: {
    label: string;
    value: string;
    note: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    pill?: string;
    pillClass?: string;
}) {
    return (
        <Card
            className="border-primary/20 bg-linear-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/5 transition-shadow duration-300 hover:shadow-xl"
        >
            <CardContent>
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                    >
                        <Icon className="size-4" />
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {value}
                    </p>
                    {pill && (
                        <Badge
                            variant="outline"
                            className={pillClass ?? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"}
                        >
                            {pill}
                        </Badge>
                    )}
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {note}
                </p>
            </CardContent>
        </Card>
    );
}

// -------------------------------------------------------------
// One quick-action row: icon, title + subtitle, arrow on the right.
// Pass href="" to make it a plain button (for pages not built yet).
// -------------------------------------------------------------
export function ActionRow({
    href,
    icon: Icon,
    iconClass,
    title,
    subtitle,
    onClick,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    title: string;
    subtitle: string;
    onClick?: () => void;
}) {
    const content = (
        <>
            <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
            >
                <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-100 dark:group-hover:text-muted-foreground">
                    {title}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {subtitle}
                </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-slate-400" />
        </>
    );

    // Rows without a page yet are buttons.
    if (!href) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="group flex w-full items-center gap-3 rounded-lg border border-primary/20 bg-card/80 p-3 text-left shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-lg border border-primary/20 bg-card/80 p-3 shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
            {content}
        </Link>
    );
}
