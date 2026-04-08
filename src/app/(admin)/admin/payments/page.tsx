import { PaymentFailureWorkbench } from "@/features/payments/components/payment-failure-workbench";
import { customers, payments } from "@/mocks/subscription-data";

export default function AdminPaymentsPage() {
  return <PaymentFailureWorkbench customers={customers} payments={payments} />;
}
