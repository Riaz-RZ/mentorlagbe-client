import { CheckCircle2, Rocket, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Trust strip stats (static numbers, same as the design).
const stats = [
    {
        icon: Star,
        color: "bg-blue-50 text-blue-600",
        number: "1.5M+",
        label: "Active Students",
    },
    {
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600",
        number: "28K+",
        label: "Verified Tutors",
    },
    {
        icon: Rocket,
        color: "bg-orange-50 text-orange-600",
        number: "25K+",
        label: "Tuition Classes",
    },
];

// =============================================================
// Trust strip: 3 stats with avatar stacks. Used on the homepage
// right after the hero.
// =============================================================
const TrustStrip = () => {
    return (
        <section className="surface-3d mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 divide-y divide-slate-200 gap-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-4 px-2 sm:px-5"
                    >
                        {/* Avatar stack */}
                        <div className="flex -space-x-2">
                            {["A", "M", "S", "R", "T"].map((initial, i) => (
                                <Avatar
                                    key={i}
                                    className="size-9 border-2 border-white ring-0 dark:border-slate-900"
                                >
                                    <AvatarFallback
                                        className={`text-xs font-semibold ${
                                            [
                                                "bg-blue-100 text-blue-700",
                                                "bg-emerald-100 text-emerald-700",
                                                "bg-orange-100 text-orange-700",
                                                "bg-purple-100 text-purple-700",
                                                "bg-rose-100 text-rose-700",
                                            ][i]
                                        }`}
                                    >
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                            >
                                <stat.icon className="size-5" />
                            </span>
                            <div>
                                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {stat.number}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TrustStrip;
