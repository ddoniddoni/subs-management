import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AuditLogPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Audit log route scaffold"
      description="This route will become the traceable history for subscription changes, refunds, coupon actions, and payment interventions."
      bullets={[
        "Filtering and event timelines are deferred to later steps.",
        "The placeholder secures the audit log route in the initial admin map.",
        "Future work will connect it to mock audit events and affected resources.",
      ]}
    />
  );
}
