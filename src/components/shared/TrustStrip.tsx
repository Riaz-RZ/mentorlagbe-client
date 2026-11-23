import { CheckCircle2, Laptop, UsersRound } from "lucide-react";

const platformFeatures = [
    {
        icon: CheckCircle2,
        title: "Reviewed tuition posts",
        description: "New listings are reviewed before students can browse them.",
    },
    {
        icon: UsersRound,
        title: "Made for both roles",
        description: "Students and tutors each get a dashboard for their work.",
    },
    {
        icon: Laptop,
        title: "Flexible learning",
        description: "Find online and in-person tuition opportunities.",
    },
];

const TrustStrip = () => {
    return (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-border">
                {platformFeatures.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <div
                            key={feature.title}
                            className="flex items-start gap-4 sm:px-5"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    {feature.title}
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TrustStrip;
