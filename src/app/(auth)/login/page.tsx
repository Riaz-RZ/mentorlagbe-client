
import Link from "next/link";
import { GraduationCap, ArrowLeft, BookOpen, Users, ShieldCheck } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-linear-to-br from-background via-background to-primary/10">
            <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

                {/* Left Side - Branding */}
                <section className="hidden lg:flex lg:flex-col lg:justify-between lg:py-12">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                                <GraduationCap className="size-7" />
                            </div>

                            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Mentor<span>Lagbe</span>
                            </span>
                        </Link>

                        <div className="mt-20 max-w-lg">
                            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-sky-400">
                                Learn. Grow. Achieve.
                            </span>

                            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                                Your next learning journey starts{" "}
                                <span className="text-blue-600">
                                    here.
                                </span>
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                                Connect with experienced tutors, discover
                                new opportunities, and make learning
                                more meaningful with MentorLagbe.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-sky-400">
                                    <BookOpen className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Find the right tutor
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Explore tutors based on your needs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                                    <Users className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Learn with confidence
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Connect and learn from professionals.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    <ShieldCheck className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        A trusted learning community
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Build meaningful learning connections.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Side - Login Form */}
                <section className="mx-auto w-full max-w-md">
                    <Link
                        href="/"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Home
                    </Link>

                    {/* Mobile Brand */}
                    <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
                        <GraduationCap className="size-8 text-blue-600" />
                        <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Mentor<span>Lagbe</span>
                        </span>
                    </div>

                    <LoginForm />
                </section>
            </div>
        </main>
    );
}
