import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  auditEvents,
  customers,
  payments,
  plans,
  subscriptions,
} from "@/mocks/subscription-data";

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionStatusWorkbench
      auditEvents={auditEvents}
      customers={customers}
      plans={plans}
      subscriptions={subscriptions}
      payments={payments}
    />
  );
}
