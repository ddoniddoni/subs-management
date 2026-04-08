import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function Home() {
  return (
    <RoutePlaceholder
      eyebrow="Customer surface"
      title="Landing page route scaffold"
      description="This homepage will introduce the subscription product, frame the business context, and direct visitors toward plan selection."
      bullets={[
        "The marketing story stays intentionally light during the bootstrap.",
        "This route now anchors the public entry point for the product.",
        "Shared customer-facing layout and richer sections will arrive in the next steps.",
      ]}
    />
  );
}
