import type { ComponentType, ReactNode } from "react";

type DashboardPageHeaderProps = {
    eyebrow: string;
    title: ReactNode;
    description: ReactNode;
    icon: ComponentType<{ className?: string }>;
    action?: ReactNode;
};

const DashboardPageHeader = ({
    eyebrow,
    title,
    description,
    icon: Icon,
    action,
}: DashboardPageHeaderProps) => {
    return (
        <section className="relative isolate overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 p-5 shadow-xl shadow-primary/5 sm:p-6 lg:p-7">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-20 size-60 rounded-full bg-primary/15 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 right-1/4 h-20 w-40 rotate-[-12deg] rounded-3xl border border-primary/15 bg-primary/5 [transform:perspective(700px)_rotateX(28deg)]"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/15 text-primary shadow-lg shadow-primary/10 [transform:perspective(700px)_rotateY(-8deg)_rotateX(5deg)] sm:flex">
                        <Icon className="size-7" />
                    </span>
                    <div className="min-w-0">
                        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                            {eyebrow}
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {title}
                        </h1>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                {action && <div className="relative shrink-0">{action}</div>}
            </div>
        </section>
    );
};

export default DashboardPageHeader;
