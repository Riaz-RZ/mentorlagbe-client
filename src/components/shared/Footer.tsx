import Link from "next/link";
import { GraduationCap, Lock, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Tuitions", href: "/tuitions" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Become a Tutor", href: "/signup" },
];

const socialPlatforms = ["X", "Facebook", "Instagram", "LinkedIn"] as const;

function SocialIcon({ platform }: { platform: (typeof socialPlatforms)[number] }) {
    if (platform === "X") {
        return (
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M18.901 1.153h3.68L14.54 10.37l9.45 12.477h-7.4l-5.8-7.585-6.64 7.585H.47l8.59-9.83L0 1.153h7.588l5.243 6.932zm-1.29 19.5h2.039L6.486 3.232H4.298z" />
            </svg>
        );
    }

    if (platform === "Facebook") {
        return (
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.9v8h3.6z" />
            </svg>
        );
    }

    if (platform === "Instagram") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 .01-4.12 2.06 2.06 0 0 1-.01 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8Z" />
        </svg>
    );
}

// =============================================================
// Site footer. Rendered by the (root) layout, so it shows on
// every public page (home, tuitions, tuition details...).
// =============================================================
const Footer = () => {
    return (
        <footer className="mt-8 w-full">
            <div className="w-full border-y border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 py-10 text-muted-foreground sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <GraduationCap className="size-5" />
                                </div>
                                <span className="text-lg font-bold text-foreground">
                                    Mentor
                                    <span>Lagbe</span>
                                </span>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed">
                                Find your perfect tutor. Teach what you love.
                            </p>
                            <div
                                role="group"
                                aria-label="Social media icons; profile links coming soon"
                                className="mt-4 flex items-center gap-3 text-foreground"
                            >
                                {socialPlatforms.map((platform) => (
                                    <span
                                        key={platform}
                                        role="img"
                                        aria-label={`${platform} profile coming soon`}
                                        title={`${platform} profile coming soon`}
                                    >
                                        <SocialIcon platform={platform} />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Quick Links
                            </p>
                            <ul className="mt-3 space-y-2">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-xs transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Contact
                            </p>
                            <address className="mt-3 not-italic">
                                <ul className="space-y-3 text-xs">
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-3.5 shrink-0" />
                                        <span>mentorlagbe@gmail.com</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-3.5 shrink-0" />
                                        <span>+880 1710101010</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MapPin className="size-3.5 shrink-0" />
                                        <span>Dhaka, Bangladesh</span>
                                    </li>
                                </ul>
                            </address>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs sm:flex-row">
                        <p>© 2026 MentorLagbe. All rights reserved.</p>
                        <p className="flex items-center gap-1.5">
                            <Lock className="size-3.5" />
                            Secure &amp; Trusted Platform
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
