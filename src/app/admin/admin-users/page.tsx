import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminUsersPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Admin users route scaffold"
      description="This screen will present internal operators, their roles, and permission visibility across the subscription operations console."
      bullets={[
        "Role badges and permission summaries will be added later.",
        "A read-only first version is enough for the initial product story.",
        "The route now exists so role-aware navigation can be layered on top next.",
      ]}
    />
  );
}
