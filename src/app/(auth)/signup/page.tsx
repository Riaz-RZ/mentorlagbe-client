
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center bg-slate-50 px-4 py-1 dark:bg-slate-950 sm:px-6 lg:py-5">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-2 lg:grid-cols-2 lg:items-start lg:gap-8">

        {/* Left Side - Brand Section */}
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 text-foreground shadow-2xl shadow-foreground/5 lg:p-8">

            {/* Decorative shapes */}
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/10" />
            <div className="absolute -bottom-28 -left-20 size-80 rounded-full bg-primary/15" />

            <div className="relative z-10">

              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/20">
                  <GraduationCap className="size-7" />
                </div>

                <span className="text-2xl font-bold tracking-tight">
                  MentorLagbe
                </span>
              </Link>

              {/* Hero Content */}
              <div className="mt-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 text-primary-foreground" />
                  Your learning journey starts here
                </div>

                <h1 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                  Find the right mentor.
                  <span className="mt-2 block text-primary-foreground">
                    Unlock your potential.
                  </span>
                </h1>

                <p className="mt-6 max-w-md leading-7 text-muted-foreground">
                  Connect with experienced tutors, learn new skills,
                  and achieve your goals with personalized learning
                  experiences.
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-8 space-y-4">
                {[
                  "Connect with qualified tutors",
                  "Choose online or offline learning",
                  "Learn at your own pace",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-primary-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Card */}
              <div className="mt-10 rounded-2xl border border-border bg-muted p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BookOpen className="size-6" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Knowledge connects us.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Learn, teach and grow together.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Right Side - Signup Form */}
        <section className="mx-auto w-full max-w-xl">

          {/* Mobile Logo */}
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap className="size-5" />
              </div>

              <span className="text-xl font-bold tracking-tight text-blue-900 dark:text-white">
                Mentor<span>Lagbe</span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </div>

          <SignupForm />
        </section>

      </div>
    </main>
  );
}
