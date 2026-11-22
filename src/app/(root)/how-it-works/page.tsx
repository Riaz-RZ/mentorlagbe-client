
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Search,
    UserPlus,
    FileText,
    Send,
    CheckCircle2,
    Users,
    ShieldCheck,
    LayoutDashboard,
    Target,
    Clock,
    MessageCircle,
    Sparkles,
    HelpCircle,
    BookMarked,
} from "lucide-react";

const studentSteps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Create Your Account",
        description:
            "Sign up as a student and create your profile. Get started in just a few simple steps.",
    },
    {
        number: "02",
        icon: Search,
        title: "Explore Tuition Opportunities",
        description:
            "Browse available tuition posts and find opportunities that match your subject, location, and budget.",
    },
    {
        number: "03",
        icon: Send,
        title: "Apply for Tuition",
        description:
            "Found the right opportunity? Submit your application and introduce yourself to the tutor.",
    },
    {
        number: "04",
        icon: CheckCircle2,
        title: "Get Selected & Start Learning",
        description:
            "Track your application from your dashboard. Once selected, connect with the tutor and begin learning.",
    },
];

const tutorSteps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Register as a Tutor",
        description:
            "Create your tutor account and build your profile with your educational background and teaching experience.",
    },
    {
        number: "02",
        icon: FileText,
        title: "Post a Tuition",
        description:
            "Share your tuition requirements, including subject, class, location, salary, and other necessary details.",
    },
    {
        number: "03",
        icon: Users,
        title: "Review Applications",
        description:
            "Receive applications from interested students and review their information to find a suitable match.",
    },
    {
        number: "04",
        icon: CheckCircle2,
        title: "Select Your Student",
        description:
            "Choose the right candidate for your tuition and move forward with the learning arrangement.",
    },
];

const features = [
    {
        icon: Search,
        title: "Easy to Find",
        description:
            "Discover suitable tuition opportunities with simple browsing and organized listings.",
    },
    {
        icon: Target,
        title: "Better Matching",
        description:
            "Find relevant opportunities based on subjects, locations, budgets, and requirements.",
    },
    {
        icon: LayoutDashboard,
        title: "Organized Dashboard",
        description:
            "Manage your tuition posts, applications, and activities from one convenient place.",
    },
    {
        icon: ShieldCheck,
        title: "Role-Based Access",
        description:
            "Dedicated experiences for students and tutors with role-based platform access.",
    },
    {
        icon: Clock,
        title: "Save Your Time",
        description:
            "Spend less time searching and managing opportunities and more time focusing on learning.",
    },
    {
        icon: MessageCircle,
        title: "One Connected Platform",
        description:
            "Bring students and tutors together to make the tuition-finding process easier.",
    },
];

const faqs = [
    {
        question: "What is MentorLagbe?",
        answer:
            "MentorLagbe is an online tuition and mentorship platform that connects students looking for learning opportunities with tutors who want to share their knowledge.",
    },
    {
        question: "How can I find a tutor?",
        answer:
            "Create a student account, browse the available tuition opportunities, and apply to the tuition that matches your learning requirements.",
    },
    {
        question: "How can I post a tuition?",
        answer:
            "Register as a tutor, access your dashboard, and create a tuition post by providing the subject, class, location, salary, and other required details.",
    },
    {
        question: "Can I track my tuition applications?",
        answer:
            "Yes. Students can view and track their application activities through their dashboard.",
    },
    {
        question: "Can I register as both a student and a tutor?",
        answer:
            "Each account is created with a selected role. Choose the role that best matches how you want to use MentorLagbe.",
    },
    {
        question: "Is MentorLagbe free to use?",
        answer:
            "You can create an account and explore the platform. Any premium features or applicable charges will be communicated clearly.",
    },
];

function StepCard({
    step,
}: {
    step: (typeof studentSteps)[number];
}) {
    const Icon = step.icon;

    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40">
            <div className="mb-6 flex items-center justify-between">
                <span className="text-4xl font-bold tracking-tight text-muted-foreground/40">
                    {step.number}
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-primary-foreground dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Icon size={23} />
                </div>
            </div>

            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                {step.title}
            </h3>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                {step.description}
            </p>
        </div>
    );
}

export default function HowItWorksPage() {
    return (
        <main className="overflow-hidden bg-background text-foreground">

            {/* Hero Section */}
            <section className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Sparkles size={16} />
                        Simple Steps, Better Connections
                    </div>

                    <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        How{" "}
                        <span className="text-emerald-500">
                            MentorLagbe
                        </span>{" "}
                        Works
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                        Finding the right tutor or the right student
                        should be simple. Discover how MentorLagbe
                        brings students and tutors together in just
                        a few easy steps.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/tuitions"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:w-auto"
                        >
                            Find a Tuition
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/signup"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-auto"
                        >
                            Become a Tutor
                            <GraduationCap size={18} />
                        </Link>
                    </div>

                    <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={17} className="text-emerald-500" />
                            Simple Process
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={17} className="text-emerald-500" />
                            Easy to Use
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={17} className="text-emerald-500" />
                            Built for Everyone
                        </span>
                    </div>
                </div>
            </section>

            {/* Student Section */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <BookOpen size={27} />
                    </div>

                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        For Students
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Start Your Learning Journey
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                        Looking for the right tutor? Follow these
                        simple steps to discover opportunities and
                        connect with the right educator.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {studentSteps.map((step) => (
                        <StepCard key={step.number} step={step} />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/tuitions"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                        Explore Tuitions
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            {/* Tutor Section */}
            <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                    <div className="mb-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <GraduationCap size={28} />
                        </div>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                            For Tutors
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Share Your Knowledge
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                            Ready to teach and make a difference?
                            Create your tutor profile, post tuition
                            opportunities, and connect with students.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {tutorSteps.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                        >
                            Join as a Tutor
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
                <div className="mb-12 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                        Why MentorLagbe
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything You Need in One Place
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                        We make the connection between students and
                        tutors easier with a simple and organized
                        platform.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <Icon size={23} />
                                </div>

                                <h3 className="mb-2 text-lg font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:py-24">
                    <div className="mb-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <HelpCircle size={27} />
                        </div>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                            FAQ
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Frequently Asked Questions
                        </h2>

                        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                            Have questions? Here are some answers to
                            help you get started.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <details
                                key={faq.question}
                                className="group rounded-xl border border-slate-200 bg-white p-5 open:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:open:border-emerald-500/40"
                                open={index === 0}
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 marker:hidden dark:text-white">
                                    <span>{faq.question}</span>

                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-transform group-open:rotate-45 dark:bg-emerald-950/50 dark:text-emerald-400">
                                        <span className="text-xl leading-none">
                                            +
                                        </span>
                                    </span>
                                </summary>

                                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative isolate overflow-hidden px-5 py-20 sm:px-8 lg:py-24">
                <div className="absolute inset-0 -z-10 bg-primary" />
                <div className="absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-foreground/10 blur-3xl" />

                <div className="mx-auto max-w-3xl text-center text-primary-foreground">
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/10">
                        <BookMarked size={28} />
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Your Next Step Starts Here
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl leading-8 text-primary-foreground/80">
                        Whether you are looking for the right learning
                        opportunity or the right student, MentorLagbe
                        is here to help you connect and grow together.
                    </p>

                    <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/tuitions"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                            Find Opportunities
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                        >
                            Join MentorLagbe
                            <UserPlus size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
