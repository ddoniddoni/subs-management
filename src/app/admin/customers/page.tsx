import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminCustomersPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Customers route scaffold"
      description="This screen will become the main operational table for searching, filtering, and reviewing customers across subscription states."
      bullets={[
        "Sortable tables and filters will be added in later steps.",
        "The route exists now so customer operations can grow without reshaping the app tree.",
        "Detailed customer views will depend on the next domain-modeling step.",
      ]}
    />
  );
}
