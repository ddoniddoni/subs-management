import { RoutePlaceholder } from "@/components/shared/route-placeholder";

export default function AdminCouponsPage() {
  return (
    <RoutePlaceholder
      eyebrow="Admin operations"
      title="Coupons route scaffold"
      description="This route will be used to issue, review, and revoke promotions tied to retention and support workflows."
      bullets={[
        "Coupon creation and revocation flows are planned for a later step.",
        "The page is reserved now so the admin route tree reflects the product plan.",
        "Future work will connect this screen to reusable form and table components.",
      ]}
    />
  );
}
