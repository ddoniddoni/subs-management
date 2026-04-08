import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminRefundsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Refunds route scaffold"
      description="This page will host the refund review queue and the approve or reject workflow for internal operators."
      bullets={[
        "Approval actions are not implemented in Step 01.",
        "The route exists now so refund workflows have a dedicated home.",
        "Reason capture and audit events will be added once shared action patterns exist.",
      ]}
    />
  );
}
