import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminPaymentsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Payments route scaffold"
      description="This route will support payment monitoring, failure handling, and links back to the affected customer and subscription records."
      bullets={[
        "Payment tables and retry workflows are intentionally deferred.",
        "The path is created now to anchor the admin payments area early.",
        "Mock payment data will be introduced in the next bootstrap phase.",
      ]}
    />
  );
}
