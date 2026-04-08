import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function SubscriptionPage() {
  return (
    <RoutePlaceholder
      eyebrow="Customer account"
      title="My subscription route scaffold"
      description="This page will show the active plan, current subscription status, renewal timing, and recent account activity for a signed-in customer."
      bullets={[
        "Subscription state badges will be introduced in a later step.",
        "The route is in place so account pages can be wired up incrementally.",
        "Future work will connect this page to shared subscription domain models.",
      ]}
    />
  );
}
