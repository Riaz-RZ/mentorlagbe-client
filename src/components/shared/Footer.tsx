import Link from "next/link";
import { GraduationCap, Lock } from "lucide-react";

// Footer link groups.
const footerLinks = [
    {
        title: "Quick Links",
        links: ["Browse Tuitions", "Pricing", "Become a Tutor", "Live Classes"],
    },
    {
        title: "Support",
        links: ["Help Center", "Contact Us", "FAQ"],
    },
    {
        title: "Legal",
        links: ["Privacy Policy", "Terms of Service"],
    },
];

// =============================================================
// Site footer. Rendered by the (root) layout, so it shows on
// every public page (home, tuitions, tuition details...).
// =============================================================
const Footer = () => {
    return (
        <footer className="mx-auto mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-slate-900 px-6 py-10 text-slate-400 sm:px-8">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <GraduationCap className="size-5" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                Mentor
                                <span className="text-sky-400">Lagbe</span>
                            </span>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed">
                            Connecting students with qualified tutors across
                            Bangladesh. Find tuition, teach online, and grow
                            together.
                        </p>
                    </div>

                    {/* Link groups */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <p className="text-sm font-semibold text-white">
                                {group.title}
                            </p>
                            <ul className="mt-3 space-y-2">
                                {group.links.map((label) => (
                                    <li key={label}>
                                        <Link
                                            href={
                                                label === "Browse Tuitions"
                                                    ? "/tuitions"
                                                    : "#"
                                            }
                                            className="text-xs transition-colors hover:text-white"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs sm:flex-row">
                    <p>© 2026 MentorLagbe. All rights reserved.</p>
                    <p className="flex items-center gap-1.5">
                        <Lock className="size-3.5" />
                        Secure &amp; Trusted Platform
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
