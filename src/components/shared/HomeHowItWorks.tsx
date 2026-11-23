import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    ClipboardCheck,
    FilePlus2,
    GraduationCap,
    Search,
    UsersRound,
} from "lucide-react";

const journeys = [
    {
        audience: "For students",
        title: "Find the right tutor",
        description: "A few clear steps take you from search to your first lesson.",
        icon: BookOpen,
        action: "Browse tuitions",
        href: "/tuitions",
        steps: [
            {
                icon: Search,
                text: "Search approved tuition listings by subject, class, and learning mode.",
            },
            {
                icon: ClipboardCheck,
                text: "Apply to a listing with your schedule and contact details.",
            },
            {
                icon: UsersRound,
                text: "Track the application and connect when the tutor responds.",
            },
        ],
    },
    {
        audience: "For tutors",
        title: "Build your next batch",
        description: "Share an opportunity and manage interested students in one place.",
        icon: GraduationCap,
        action: "Join as a tutor",
        href: "/signup",
        steps: [
            {
                icon: FilePlus2,
                text: "Create a tuition post with the subject, class, fee, and schedule.",
            },
            {
                icon: ClipboardCheck,
                text: "Review student applications from your tutor dashboard.",
            },
            {
                icon: UsersRound,
                text: "Accept suitable students and manage your listing as your batch grows.",
            },
        ],
    },
];

const HomeHowItWorks = () => {
    return (
        <section className="mt-14">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Simple steps, better connections
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    How MentorLagbe Works
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                    Whether you are looking for a tutor or growing a teaching
                    batch, getting started is straightforward.
                </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {journeys.map((journey) => {
                    const JourneyIcon = journey.icon;

                    return (
                        <article
                            key={journey.audience}
                            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start gap-4">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                    <JourneyIcon className="size-6" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                        {journey.audience}
                                    </p>
                                    <h3 className="mt-1 text-xl font-bold text-foreground">
                                        {journey.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {journey.description}
                                    </p>
                                </div>
                            </div>

                            <ol className="mt-6 space-y-4">
                                {journey.steps.map((step, index) => {
                                    const StepIcon = step.icon;

                                    return (
                                        <li key={step.text} className="flex gap-3">
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                                                <StepIcon className="size-4" aria-hidden="true" />
                                            </span>
                                            <p className="pt-1 text-sm leading-6 text-muted-foreground">
                                                <span className="mr-2 font-semibold text-foreground">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                {" "}
                                                {step.text}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ol>

                            <Link
                                href={journey.href}
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                            >
                                {journey.action}
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default HomeHowItWorks;
