import { SubscriptionStatusWorkbench } from "@/features/customers/components/subscription-status-workbench";
import {
  customers,
  payments,
  plans,
  subscriptions,
} from "@/mocks/subscription-data";

export default function AdminCustomersPage() {
  return (
    <SubscriptionStatusWorkbench
      customers={customers}
      plans={plans}
      subscriptions={subscriptions}
      payments={payments}
    />
  );
}
