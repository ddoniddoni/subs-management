import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function CheckoutPage() {
  return (
    <RoutePlaceholder
      eyebrow="Customer surface"
      title="Checkout flow route scaffold"
      description="This route will host the mocked subscription purchase flow, including selected plan details, customer inputs, and a checkout confirmation state."
      bullets={[
        "Real payment processing is out of scope for the bootstrap.",
        "This placeholder reserves the route for the portfolio product story.",
        "Form structure and validation will be added after the shared UI layer exists.",
      ]}
    />
  );
}
