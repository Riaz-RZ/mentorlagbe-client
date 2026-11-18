
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Left Side - Brand Section */}
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white shadow-2xl shadow-blue-500/20">

            {/* Decorative shapes */}
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -left-20 size-80 rounded-full bg-sky-300/20" />

            <div className="relative z-10">

              {/* Logo */}
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <GraduationCap className="size-7" />
                </div>

                <span className="text-2xl font-bold tracking-tight">
                  MentorLagbe
                </span>
              </Link>

              {/* Hero Content */}
              <div className="mt-20">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                  <Sparkles className="size-4 text-yellow-300" />
                  Your learning journey starts here
                </div>

                <h1 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                  Find the right mentor.
                  <span className="mt-2 block text-sky-200">
                    Unlock your potential.
                  </span>
                </h1>

                <p className="mt-6 max-w-md leading-7 text-blue-50">
                  Connect with experienced tutors, learn new skills,
                  and achieve your goals with personalized learning
                  experiences.
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-12 space-y-5">
                {[
                  "Connect with qualified tutors",
                  "Choose online or offline learning",
                  "Learn at your own pace",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-sky-200" />
                    <span className="text-sm font-medium text-white/95">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Card */}
              <div className="mt-16 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white text-blue-600">
                    <BookOpen className="size-6" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Knowledge connects us.
                    </p>
                    <p className="mt-1 text-sm text-blue-100">
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
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap className="size-6" />
              </div>

              <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
                Mentor<span className="text-blue-600 dark:text-sky-400">
                  Lagbe
                </span>
              </span>
            </Link>
          </div>

          <SignupForm />
        </section>

      </div>
    </main>
  );
}
