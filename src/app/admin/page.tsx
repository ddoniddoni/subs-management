import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Admin overview route scaffold"
      description="This route will become the operational home for KPIs, alerts, payment health, and refund queue visibility."
      bullets={[
        "Dashboard cards and charts are deferred to a later bootstrap step.",
        "The route is available now so admin information architecture is in place.",
        "Shared admin navigation will be added before deeper workflow screens.",
      ]}
    />
  );
}
