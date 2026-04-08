import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminAnalyticsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Analytics route scaffold"
      description="This route will show operational charts for revenue, subscription health, churn, failed payments, and refund trends."
      bullets={[
        "Charts are deliberately postponed until metric snapshots are modeled.",
        "This placeholder reserves the analytics surface in the admin console.",
        "The future implementation will focus on operational insight rather than decoration.",
      ]}
    />
  );
}
