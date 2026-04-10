import { CouponOperationsWorkbench } from "@/features/coupons/components/coupon-operations-workbench";
import { auditEvents, coupons, customers } from "@/mocks/subscription-data";

export default function AdminCouponsPage() {
  return (
    <CouponOperationsWorkbench
      auditEvents={auditEvents}
      coupons={coupons}
      customers={customers}
    />
  );
}
