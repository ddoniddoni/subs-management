import { CustomerOpsTableView } from "@/features/customers/components/customer-ops-table-view";
import { customers, payments, plans, subscriptions } from "@/mocks/subscription-data";

export default function AdminCustomersPage() {
  return (
    <CustomerOpsTableView
      customers={customers}
      payments={payments}
      plans={plans}
      subscriptions={subscriptions}
    />
  );
}
