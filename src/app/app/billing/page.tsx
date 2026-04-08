import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function BillingPage() {
  return (
    <RoutePlaceholder
      eyebrow="Customer account"
      title="Billing history route scaffold"
      description="This page will present invoice and payment history so customers can review charges, failed payments, and refund-related billing events."
      bullets={[
        "A reusable billing table will be added after table primitives are in place.",
        "The screen is intentionally simple until mock billing data exists.",
        "This route ensures the customer account section is mapped early.",
      ]}
    />
  );
}
