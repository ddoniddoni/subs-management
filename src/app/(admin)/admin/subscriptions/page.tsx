import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  auditEvents,
  coupons,
  customers,
  payments,
  plans,
  refunds,
  subscriptions,
} from "@/mocks/subscription-data";

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionStatusWorkbench
      auditEvents={auditEvents}
      coupons={coupons}
      customers={customers}
      payments={payments}
      plans={plans}
      refunds={refunds}
      subscriptions={subscriptions}
    />
  );
}
