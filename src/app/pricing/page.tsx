import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function PricingPage() {
  return (
    <RoutePlaceholder
      eyebrow="Customer surface"
      title="Pricing page route scaffold"
      description="This screen will compare subscription plans, billing cadence, and plan-level value for prospective customers."
      bullets={[
        "Plan cards and feature comparison will be added in a later step.",
        "The page exists now so the customer route map is in place.",
        "Content stays intentionally simple until shared layout and UI primitives are ready.",
      ]}
    />
  );
}
