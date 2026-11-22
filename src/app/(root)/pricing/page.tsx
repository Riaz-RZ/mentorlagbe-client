import PlanSection from "@/components/shared/PlanSection";

// =============================================================
// Pricing page (/pricing): the Free vs Pro plan section, linked
// from the navbar and used as the plan-limit redirect target.
// =============================================================
export default function PricingPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
            <PlanSection />
        </main>
    );
}
