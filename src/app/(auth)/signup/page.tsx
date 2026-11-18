
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type UserRole = "student" | "tutor";

export default function SignupPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Integrate Better Auth here later.
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role,
      };

      console.log("Registration data:", registrationData);

      // Temporary frontend-only success feedback.
      await new Promise((resolve) => setTimeout(resolve, 700));

      toast.success("Form validated successfully!", {
        description:
          "Better Auth integration is the next step.",
      });

      // Do not reset the form until authentication is integrated.
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Left Side - Brand Section */}
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white shadow-2xl shadow-blue-500/20">

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
                  Connect with experienced tutors, learn new
                  skills, and achieve your goals with
                  personalized learning experiences.
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

              {/* Bottom illustration-style card */}
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

        {/* Right Side - Registration Form */}
        <section className="mx-auto w-full max-w-xl">

          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap className="size-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
                Mentor<span className="text-blue-600 dark:text-sky-400">Lagbe</span>
              </span>
            </Link>
          </div>

          <Card className="border-slate-200/80 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardHeader className="space-y-2 pb-5">
              <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-sky-400">
                <Users className="size-6" />
              </div>

              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </CardTitle>

              <CardDescription className="text-sm leading-6">
                Join MentorLagbe and start your learning journey
                today.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>
                    I want to join as a
                  </Label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        role === "student"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/50"
                          : "border-slate-200 hover:border-blue-300 dark:border-slate-700"
                      }`}
                    >
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        role === "student"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}>
                        <BookOpen className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Student
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Find tutors
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("tutor")}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        role === "tutor"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/50"
                          : "border-slate-200 hover:border-blue-300 dark:border-slate-700"
                      }`}
                    >
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                        role === "tutor"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}>
                        <GraduationCap className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Tutor
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Teach students
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>

                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 pl-10"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pl-10 pr-11"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 pl-10 pr-11"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-2">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 size-4 cursor-pointer accent-blue-600"
                  />

                  <Label
                    htmlFor="agreeToTerms"
                    className="cursor-pointer text-sm font-normal leading-5 text-muted-foreground"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-blue-600 hover:underline dark:text-sky-400"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-blue-600 hover:underline dark:text-sky-400"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
                <Separator className="flex-1" />
              </div>

              {/* Google Sign Up - UI only */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full"
                onClick={() =>
                  toast.info("Google sign-up will be available soon.")
                }
              >
                <span className="mr-2 flex size-5 items-center justify-center rounded-full border text-sm font-bold">
                  G
                </span>
                Sign up with Google
              </Button>

              {/* Login Link */}
              <p className="mt-7 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline dark:text-sky-400"
                >
                  Sign In
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} MentorLagbe. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
