import Hero from "@/components/shared/Hero";
import TrustStrip from "@/components/shared/TrustStrip";
import FeaturedTuitions from "@/components/shared/FeaturedTuitions";
import PlanSection from "@/components/shared/PlanSection";

export default function Home() {
    return (
        <main className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
            {/* Hero + tabs */}
            <Hero />

            {/* Stats: students / tutors / classes */}
            <TrustStrip />

            {/* 6 newest approved tuitions */}
            <FeaturedTuitions />

            {/* Free vs Pro pricing (Stripe later) */}
            <PlanSection />
        </main>
    );
}
