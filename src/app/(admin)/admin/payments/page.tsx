import { PaymentFailureWorkbench } from "@/features/payments/components/payment-failure-workbench";
import { auditEvents, customers, payments } from "@/mocks/subscription-data";

export default function AdminPaymentsPage() {
  return (
    <PaymentFailureWorkbench
      auditEvents={auditEvents}
      customers={customers}
      payments={payments}
    />
  );
}
